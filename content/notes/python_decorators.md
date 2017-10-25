+++
date = "2017-10-23"
draft = false
title = "Python decorators"
hidefromhome = true
+++

Basics
```python
def my_decorator(some_function):
    def wrapper():
        print("Something is happening before some_function() is called.")
        some_function()
        print("Something is happening after some_function() is called.")

    return wrapper

def just_some_function():
    print("Wheee!")

just_some_function = my_decorator(just_some_function)
just_some_function()
```

Examples
```python
import time

def timing_function(some_function):
    """
    Outputs the time a function takes
    to execute.
    """
    def wrapper():
        t1 = time.time()
        some_function()
        t2 = time.time()
        return "Time it took to run the function: " + str((t2 - t1)) + "\n"
    return wrapper

@timing_function
def my_function():
    num_list = []
    for num in (range(0, 10000)):
        num_list.append(num)
    print("\nSum of all the numbers: " + str((sum(num_list))))

print(my_function())
```

Rating limiting in flask
```python
from functools import wraps
from flask import g, request, redirect, url_for

def login_required(f):
    # Did you notice that the function gets passed to the functools.wraps() decorator?
    # This simply preserves the metadata of the wrapped function.
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function


@app.route('/secret')
@login_required
def secret():
    pass
```

decorator that saves/memorizes values
```python
def memoize(func):
    cache = func.cache = {}

    @functools.wraps(func)
    def memoized_func(*args, **kwargs):
        key = str(args) + str(kwargs)
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return memoized_func

@memoize
def fibonacci(n):
    if n == 0:return 0
    if n == 1:return 1
    else: return fib(n-1) + fib(n-2)
```

