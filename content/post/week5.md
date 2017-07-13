+++
date = "2017-07-19"
title = "week 5 - Bloom filters and you"
draft = false
+++

### Use cases
### Intro to bloom filters
### Math behind it

### Python example
Here's my attempt at recreating a bloom filter in python

```python
import math
import hashlib

import bitarray
import mmh3


def calc_optimal_hash_func(lenght_of_entries):
    m = (-lenght_of_entries * math.log(0.01)) / ((math.log(2)) ** 2)
    k = (m / lenght_of_entries) * math.log(2)

    return int(m), int(math.ceil(k))


def lookup(string, bit_array, seeds):
    for seed in range(seeds):
        result = mmh3.hash(string, seed) % len(bit_array)
        # print "seed", seed, "pos", result, "->", bit_array[result]
        if bit_array[result] == False:
            return string, "Def not in dictionary"

    return string, "Probably in here"


def load_words():
    data        = []
    word_loc    = '/usr/share/dict/words'

    with open(word_loc, 'r') as f:
        for word in f.readlines():
            data.append(word.strip())

    return data


def get_bit_array():
    words               = load_words()
    w_length            = len(words)
    array_length, seeds  = calc_optimal_hash_func(w_length)
    bit_array           = array_length * bitarray.bitarray('0')

    for word in words:
        try:
            for seed in range(seeds):
                # print "word", word, "seed", seed, "pos", result, "->", bit_array[result]
                pos = mmh3.hash(word, seed) % array_length
                bit_array[pos] = True
        except:
            pass

    return seeds, bit_array

if __name__ == '__main__':
    seeds, ba = get_bit_array()
    print(lookup('badwordforsure', ba, seeds))
    print(lookup('cat', ba, seeds))
    print(lookup('hello', ba, seeds))
    print(lookup('jsalj', ba, seeds))
```
