We're tasked with writing a function that takes in a "special" array and returns the product sum.

The special array is non-empty and contains integers or other arrays. We can get the product sum of an array by adding all of its elements together and then multiplying by the level of depth of the array.

The depth is determined by how nested the array is.
Ex. The depth of [] is 1. The depth of the inner array in [[]] is 2. The depth of the innermost array in [[[]]] is 3.

In an array, [x, y], the product sum is (x + y). In array [x, [y, z]], the product sum is x + 2 * (y + z). In array [x, [y, [z]]], the product sum is x + 2 * (y + 3z).