import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import 'cal-heatmap/cal-heatmap.css';

const TOPICS = [
  "Github contributes/code",
  "making art",
  "playing music",
  "3d printing",
  "exercices/health",
  "books",
  "tv shows"
];

// Helper to generate dummy data
const generateData = (topic) => {
  const data = [];
  const now = new Date();
  // Generate 12 months history
  const startDate = new Date(now);
  startDate.setMonth(now.getMonth() - 11);
  startDate.setDate(1);

  // Simple hash for consistency per topic
  let seed = topic.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const random = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  const dayMilliseconds = 24 * 60 * 60 * 1000;
  for (let d = startDate.getTime(); d <= now.getTime(); d += dayMilliseconds) {
    if (random() > 0.6) {
      data.push({
        date: d,
        value: Math.floor(random() * 10) + 1
      });
    }
  }
  return data;
};

export function ActivityHeatmap() {
  const [index, setIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5000);
  
  // Two instances for split view
  const calRef1 = useRef(null);
  const calRef2 = useRef(null);
  const containerId1 = useRef(`cal-heatmap-1-${Math.random().toString(36).substr(2, 9)}`);
  const containerId2 = useRef(`cal-heatmap-2-${Math.random().toString(36).substr(2, 9)}`);
  const wrapperRef = useRef(null);
  
  const currentTopic = TOPICS[index];
  const totalTime = 5000;

  // Timer
  useEffect(() => {
    const interval = 50;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          setIndex((prevIndex) => (prevIndex + 1) % TOPICS.length);
          return totalTime;
        }
        return prev - interval;
      });
    }, interval);

    return () => clearInterval(timerId);
  }, []);

  // Paint function to be reused
  const paintCalendar = (calInstance, containerId, startDate, range, cellSize) => {
    if (!calInstance) return;
    
    // Destroy existing before repainting to be safe, though paint can sometimes update
    // But for clean resizing/data changes, usually better to destroy if logic changes significantly
    if (calInstance.paint) {
       // cal-heatmap v4 instances are reusable, but paint is stateful.
       // We'll trust the paint method's update capability or destroy if needed.
    }

    const data = generateData(currentTopic);

    calInstance.paint({
      itemSelector: `#${containerId}`,
      range: range,
      domain: { type: 'month', gutter: 10, label: { height: 25 } },
      subDomain: { type: 'day', width: cellSize, height: cellSize, gutter: 2 },
      date: { start: startDate },
      data: { source: data, x: 'date', y: 'value' },
      theme: 'light',
      scale: {
        color: {
          type: 'threshold',
          range: ['#ebedf0', '#f8bbd0', '#f06292', '#e91e63', '#880e4f'],
          domain: [1, 3, 5, 7]
        },
      },
    },
    [
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              (value ? value : "No") +
              " contributions on " +
              dayjsDate.format("dddd, MMMM D, YYYY")
            );
          },
        },
      ],
    ]);
  };

  // Main Effect for Logic and Resizing
  useLayoutEffect(() => {
    // Wait for DOM
    const el1 = document.getElementById(containerId1.current);
    const el2 = document.getElementById(containerId2.current);
    if (!el1 || !el2 || !wrapperRef.current) return;

    // Initialize instances if null
    if (!calRef1.current) calRef1.current = new CalHeatmap();
    if (!calRef2.current) calRef2.current = new CalHeatmap();

    const render = () => {
       const width = wrapperRef.current.clientWidth;
       // We want 6 months per row.
       // 6 months is approx 26 weeks.
       // cellSize * 26 + gaps...
       // approx 27 columns accounts for gaps.
       let computedCellSize = Math.floor((width - 40) / 28); 
       if (computedCellSize < 8) computedCellSize = 8; // min size
       if (computedCellSize > 15) computedCellSize = 15; // max size caps
       
       const now = new Date();
       
       // Row 1: Months -11 to -6
       const start1 = new Date(now);
       start1.setMonth(now.getMonth() - 11);
       start1.setDate(1);
       
       // Row 2: Months -5 to 0
       const start2 = new Date(now);
       start2.setMonth(now.getMonth() - 5);
       start2.setDate(1);

       // Clean up old painters to prevent artifacts on resize
       calRef1.current.destroy();
       calRef2.current.destroy();
       calRef1.current = new CalHeatmap();
       calRef2.current = new CalHeatmap();

       paintCalendar(calRef1.current, containerId1.current, start1, 6, computedCellSize);
       paintCalendar(calRef2.current, containerId2.current, start2, 6, computedCellSize);
    };

    render();

    const handleResize = () => {
        // Debounce simple
        render();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (calRef1.current) calRef1.current.destroy();
      if (calRef2.current) calRef2.current.destroy();
    };
  }, [currentTopic]);

  const progressPercentage = Math.max(0, (timeLeft / totalTime) * 100);

  return (
    <div className="heatmap-widget" ref={wrapperRef}>
      <p style={{ marginBottom: '0.5rem' }}>
        These are recently contributions to 
        <span className="topic-container" style={{ position: 'relative', display: 'inline-block', marginLeft: '0.3em' }}>
          <span className="topic-text" style={{ fontWeight: 'bold' }}>{currentTopic}</span>
          <span 
            className="progress-underline" 
            style={{ 
              position: 'absolute', 
              bottom: '-2px', 
              left: 0, 
              height: '2px', 
              backgroundColor: '#ca7271', 
              width: `${progressPercentage}%`,
              transition: 'width 0.05s linear'
            }}
          />
        </span>.
      </p>

      <div id={containerId1.current} style={{ minHeight: '110px', overflow: 'hidden' }}></div>
      <div id={containerId2.current} style={{ minHeight: '110px', overflow: 'hidden' }}></div>
    </div>
  );
}
