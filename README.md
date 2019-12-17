# rockstar-js

Rockstar written in Node.js.

## Installation

```sh
$ npm install dqn/rockstar-js
```

## Usage

```js
const Rockstar = require('rockstar-js');

const rockItBro = new Rockstar({
  days: 300,
});

rockItBro.makeMeARockstar();
```

Available options:

Name | Optional | Default | Description
--- | --- | --- | --- 
days | No | `400` | Days to rock.
filePath | No | `main.cpp` | File name to create.
code | No | After that | Source code to be finally written.
daysOff | No | `[]` |  Array of days not to commit. (e.g. `[ 'Saturday', 'Sunday' ]`)
offFraction | No | `0.0` | Probability not to commit on that day.
maxCommitsPerDay | No | `10` | Maximum number of commits per day.

Default code:
```cpp
#include <iostream>
int main()
{
  std::cout << "Hello World!" << std::endl;
  return 0;
}

```