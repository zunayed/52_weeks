+++
date = "2019-07-28"
draft = false
title = "Generate all subsets of a set recursively"
tags = [ "recursion"]
+++

Problem statement

> Given a set (in form of string s containing only distinct lowercase letters ('a' - 'z')), you have to generate ALL possible subsets of it .
> 
> 
> Input:	"xy"  
> Output: 	["", "x", "y", "xy"]
>

Here's my approach to this problem

1. Recursively calling generate subset function with smaller subsets of the input string. 

2. We can use an index variable and keep incrementing the value as we go down our recursive tree. We should generate all the subsets without the current index and then with the current index. Once we have both the sides both the generated subsets

3. Our base case will be when our index reaches the length of the original string.

4. We're going to need a way to keep a running list of variables we want to include


so our function signature for our recursive function will look like

```python
def gen_subset(s, seen, index):
	       ^  ^	^------- current position (2)
	       |  -------------- running list of string elements we want to include (4)
	       ----------------- origional string
```

A good way to visualize the recursion is to draw out the recursion tree for this problem

![Example image](/images/p8/full_tree.png)

If we zoom into a few of the paths you can see how the `seen` and `index` variable changes as we go down the chain

![Example image](/images/p8/partial_tree.png)

The recursion tree is basically a different representation of the call stack

![Example image](/images/p8/call_stack.png)

```python
def gen_subsets(s, seen, index):
    if index == len(s):
        return [seen[:index]]
    
    l = gen_subsets(s, seen, index+1)
    seen = seen + s[index]
    r = gen_subsets(s, seen, index+1)
    
    return l + r

def generate_all_subsets(s):
    return gen_subsets(s, '', 0)
```

