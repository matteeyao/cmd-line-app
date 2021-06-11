# Node I/O is Async

Ruby has the methods `puts` and `gets`. JavaScript has `console.log` as an analogue to `puts`, but it doesn't have an exact analogue for `gets`.

In a web browser, you may use the `prompt` method to pop up a message box to ask for input from the user. When running server-side code in the node.js environment, `prompt` is not available (b/c node is not a graphical environment).

Instead, you must use the `readline` library when writing server-side node.js programs → [documentation](http://nodejs.org/api/readline.html)

Here's a simple example:

```js
const readline = require('readline');

const reader = readline.createInterface({
  /* Below, we will want to
  1. output the prompt to the standard output (console)
  2. read input from the standard input (again, console) */
  input: process.stdin,
  output: process.stdout
});

reader.question("What is your name?", function (answer) {
  console.log(`Hello ${answer}!`);
});

console.log("Last program line");
```

Run this code using the cmd `node readline_demo.js`.

The `question` method takes a prompt ("What is your name?") and a callback. It will print the prompt, and then ask node.js to read a line from `stdin`. `question` is asynchronous; it will not wait for the input to be read, it returns immediately. When Node.js has received the input from the user, it will call the callback we passed to `reader.question`.

Let's see this in action:

```
~/jquery-demo$ node test.js
What is your name?
Last program line
Ned
Hello Ned!
```

Notice that b/c `reader.question` returns immediately and does not wait, it prints "Last program line" before you get a chance to write anything. Notice also that the code doesn't try to save or use the return value of `reader.question` since `reader.question` does not return anything. `reader.question` cannot return the input, b/c the function returns before we have actually typed in any input. ** Asynchronous functions do not return meaningful values: we give them a callback so that the result of the async operation can be communicated back to us.**

One final note: note that our program didn't end when it hits the end of the code. It patiently waited for our input. That's because Node understands that there is an outstanding request for user input. Node knows that the program may not be done yet: anything could happen in response to that input. So for that reason, Node doesn't terminate the program just because we hit the end of the source file. If we want to stop accepting input, we have to explicitly call `reader.close()`:

```js
const readline = require('readline');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

reader.question("What is your name?", function (answer) {
  console.log(`Hello ${answer}!`);

  /* Close the reader, which will allow the program to end because it
  is no longer waiting for any events. */
  reader.close();
});

console.log("Last program line");
```

---

Let's see a more developed example:

```js
const readline = require('readline');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function addTwoNumbers(callback) {
  /* Notice how nowhere do we return anything here. You never return in
  async code. Since the caller will not wait for the result, you
  can't return anything to them. */
  reader.question("Enter #1: ", function (numString1) {
    reader.question("Enter #2: ", function (numString2) {
      const num1 = parseInt(numString1);
      const num2 = parseInt(numString2);

      callback(num1 + num2);
    });
  });
}

addTwoNumbers(function (result) {
  console.log(`The result is: ${result}`);
  reader.close();
});
```

Notice the use of closures and callbacks:

1. `function (numString1) { ...`'s closure scope includes the `callback` variable. `numString1` is a regular argument.

2. `function (numString2) { ...`'s closure scope includes the `numString1` variable, as well as `callback` recursively. `numString2` is a regular argument.

3. `function (result) { ...`'s closure scope includes `reader`. `result` is a regular argument.

Note, `callback` is not a JavaScript keyword. It is simply the name of the function we are passing to `addTwoNumbers` as a callback.

---

Let's write a silly method, called `absurdTimes`:

```js
function absurdTimes(numTimes, fn) {
  let i = 0;

  function loopStep() {
    if (i == numTimes) {
      // we're done, stop looping
      return;
    }

    fn();

    i++;
    // recursively call loopStep
    loopStep();
  }

  loopStep();
}
```

Notice how this loops in a weird way. Of course, this is an absurd way to implement `times`, and you wouldn't do this normally. But we're going to build on this in a moment...

---

When we need to do a loop in code that is asynchronous, we can modify the trick from above:

```js
const readline = require('readline');

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function absurdTimesAsync (numTimes, fnAsync, completionFn) {
  let i = 0;

  function loopStep () {
    if (i == numTimes) {
      // we're done, stop looping
      completionFn();
      return;
    }

    i++;

    // fnAsync is an asynchronous function that takes a callback (in this case loopStep)
    fnAsync(loopStep);
  }

  loopStep();
}

function addTwoNumbersAsync(callback) {
  reader.question("Enter #1: ", function (numString1) {
    reader.question("Enter #2: ", function (numString2) {
      const num1 = parseInt(numString1);
      const num2 = parseInt(numString2);

      callback(num1 + num2);
    });
  });
}

let totalSum = 0;

function addTwoNumbersAndIncrementAsync(callback) {
  addTwoNumbersAsync(function (result) {
    totalSum += result;

    console.log(`Sum: ${result}`);
    console.log(`Total Sum: ${totalSum}`);

    callback();
  });
}

function outputResultAndCloseReader () {
  console.log(`All done! Total Sum: ${totalSum}`);
  reader.close();
}

absurdTimesAsync(3, addTwoNumbersAndIncrementAsync, outputResultAndCloseReader);
```

A normal times method like so would not work:

```js
function times(times, fn) {
  for (let i = 0; i < times; i++) {
    fn();
  }
}
```

If `fn` is asynchronous, it will return immediately, even though its work is not done. By passing a callback ―― `loopStep` ―― as the callback to `fn` (as we do in `absurdTimes`), `fn` can call `loopStep` **after** `fn`**'s work is completed**.

We also added an argument, `completionFn` so that we could call code when all the iterations are completed. I use this to print the total sum a final time, and close the reader so the program can end.
