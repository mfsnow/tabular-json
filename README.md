# Tabular JSON
This node module helps manipulate tabular data found in a JSON object. Data with sub-objects, including arrays, can be flattened, converted into an array, an HTML table, or a delimited string. Many options are available to customize each function.

## Install
```
npm install tabular-json
```

## Usage
```js
var tabular = require('tabular-json');
```

### Functions
- `flatten(obj, options)` - Convert to array. Each row is an object.
- `array(obj, options)` - Convert to array. Each row is a sub-array.
- `delimit(obj, options)` - Convert to delimited string (such as csv).
- `html(obj, options)` - Convert to HTML table `<table>`.

### Flatten
#### flatten(obj, options)
- `obj` - Object to convert to array.
- `options` - (Optional) A JSON object containing customizations
  - `headers` - Array - Headers to include in output array. Defaults to all properties found in object.
  - `sort` - Array or String - Header(s) to sort by.
    - Prefix a string with minus `'-'` to sort in descending order.
  - `dot` - String - The string that sub-objects in header strings. Defaults to `'.'`.

#### flatten(obj, options) Example
```js
var obj = [
  {
    Name: "Jane",
    Age: 47,
    Address: {
      City: "Detroit",
      State: "Michigan"
    }
  },
  {
    Name: "John",
    Age: 35,
    Address: {
      City: "New York",
      State: "New York"
    }
  },
  {
    Name: "Steve",
    Age: 35,
    Address: {
      City: "Buffalo",
      State: "New York"
    }
  }
];

var opts = {
  dot: ' / ',
  headers: ["Name", "Age","Address / City"],
  sort: ["-Age", "Address / City"] // Sort first by 'Age', oldest first, then by 'Address / City'
};

var result = tabular.flatten(obj, opts);
```

The variable `result` contains the array:
```js
[
  {Name: "Jane", Age: 47, "Address / City": "Detroit"},
  {Name: "Steve", Age: 35, "Address / City": "Buffalo"},
  {Name: "John", Age: 35, "Address / City": "New York"}
]
```
### Array
#### array(obj, options)
- `obj` - Object to convert to array.
- `options` - (Optional) A JSON object containing customizations. All options in `flatten()`, plus:
  - `includeHeaders` - Boolean - If true, the first element in output will be an array of the headers. Defaults to `true`.

#### array(obj, options) Example
```js
opts = {
  sort: "Name"
};

result = tabular.array(obj, opts);
```

The variable `result` contains the array:
```js
[
  ["Name", "Age", "Address.City", "Address.State"],
  ["Jane", 47, "Detroit", "Michigan"],
  ["John", 35, "New York", "New York"],
  ["Steve", 35, "Buffalo", "New York"]
]
```

#### array(obj, options) Complex Example
Tabular can handle much more complex objects. If sub-array are contained in `obj`, the output will reflect the sub-arrays by containing a row for each element. There is no limit to the complexity of the object.
```js
var customers = [
  {
    name: "Acme Ltd",
    address: {
      city: "Las Vegas",
      state: "Nevada"
    },
    orders: [
      {
        id: "SO1",
        shipments: [
          {id: "INV1"}, {id: "INV2"}
        ]
      },
      { id: "SO2", orderedAt: new Date("January 1, 2000")}
    ],
    contacts: [
      "Jim",
      "Johanna"
    ]
  }, {
    name: "ABC Co",
    address: {
      city: "Las Angeles"
    },
    orders: [
      {id: "SO3",
    shipments: [{id: "INV3"}]}
    ]
  }, {
    name: "XYZ Inc"
  }
];

result = tabular.array(customers);
```

The variable `result` contains the array:
```js
[
  [ 'name', 'address.city', 'address.state', 'orders.id', 'orders.shipments.id', 'orders.orderedAt', 'contacts' ],
  [ 'XYZ Inc', null, null, null, null, null, null ],
  [ 'Acme Ltd','Las Vegas','Nevada','SO2',null,Sat Jan 01 2000 00:00:00 GMT-0500 (EST),null ],
  [ 'Acme Ltd', 'Las Vegas', 'Nevada', 'SO1', 'INV1', null, null ],
  [ 'Acme Ltd', 'Las Vegas', 'Nevada', 'SO1', 'INV2', null, null ],
  [ 'ABC Co', 'Las Angeles', null, 'SO3', 'INV3', null, null ],
  [ 'Acme Ltd', 'Las Vegas', 'Nevada', null, null, null, 'Jim' ],
  [ 'Acme Ltd', 'Las Vegas', 'Nevada', null, null, null, 'Johanna' ]
]
```

### Delimit
#### delimit(obj, options)
- `obj` - Object to convert to delmited string.
- `options` - (Optional) A JSON object containing customizations. All options in `array()`, plus:
  - `separator` - String - Value separator. Defaults to `','`.
  - `stringWrap` - String - Wrapper for string values. Defaults to `'"'`.
  - `escape` - String or Function - String values can be manipulated by this function, or prepended with the string. Defaults to a function that doubles any the `stringWrap` within the string value.
    - Example: The value `6' 2"` would escape to `6' 2""` using the default value.
    - `function(value, wrap)` - Function - Should return the escaped value, escaped in the desired format.
      - `value` - String - The original value.
      - `wrap` - String - The `stringWrap` variable, provided in the function.
  - `eol` - String - string to append at the end of each line. Defaults to `'\n'`.
  - `dateFormatter` - Function - Function that formats any Date value. Defaults to converting dates using the Date function `toLocaleDateString()`.

#### delimit(obj, options) Example
```js
obj = {
  Name: "John",
  Height: "6' \"2",
  "Birth Day": new Date("June 12, 1994")
};

opts = {
  sort: "Name",
  separator: ';',
  stringWrap: "'",
  escape: function(str, wrap) {return str.replace(new RegExp("("+wrap+")", "g"), '\\$1');},
  dateFormatter: function(date) {return date.toISOString().substr(0,10);}
};

result = tabular.delimit(obj, opts);
```

The variable `result` contains the string:
```
'Name';'Height';'Birth Day'
'John';'6\' "2';1994-06-12

```

### Html
#### html(obj, options)
- `obj` - Object to convert to an html string.
- `options` - (Optional) A JSON object containing customizations. All options in `array()`, plus:
  - `separator` - String - Separates html elements. Defaults to `'\t'`.
  - `eol` - String - End of line string. Defaults to `'\n'`.
  - `escapeInnerHTML` - Boolean - Determines if values that contain HTML elements should be escaped so they would not be included in the DOM. Defaults to `true`.
  - `convertLinks` - Boolean - Determines if values that look like web links should be converted to link anchors. Defaults to `false`.
  - `classes` - Object - Add class values by including the properties (all optional): {`table`, `thead`, `tr`, `th`, `tbody`, `td`}.

#### html(obj, options) Example
```js
opts = {
  dot: "/",
  separator: '  ',
  dateFormatter: function(date) {return date.toISOString().substr(0,10);},
  sort: ["name", "address/state", "address/city", "-contacts"],
  classes: {table: "table table-striped table-bordered"}
};

result = tabular.html(customers, opts);
```

The variable `result` contains the string:
```html
<table class="table table-striped table-bordered">
  <thead>
    <tr>
      <th>name</th>
      <th>address/city</th>
      <th>address/state</th>
      <th>orders/id</th>
      <th>orders/shipments/id</th>
      <th>orders/orderedAt</th>
      <th>contacts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>ABC Co</td>
      <td>Las Angeles</td>
      <td></td>
      <td>SO3</td>
      <td>INV3</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Acme Ltd</td>
      <td>Las Vegas</td>
      <td>Nevada</td>
      <td>SO2</td>
      <td></td>
      <td>2000-01-01</td>
      <td></td>
    </tr>
    <tr>
      <td>Acme Ltd</td>
      <td>Las Vegas</td>
      <td>Nevada</td>
      <td>SO1</td>
      <td>INV1</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Acme Ltd</td>
      <td>Las Vegas</td>
      <td>Nevada</td>
      <td>SO1</td>
      <td>INV2</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td>Acme Ltd</td>
      <td>Las Vegas</td>
      <td>Nevada</td>
      <td></td>
      <td></td>
      <td></td>
      <td>Johanna</td>
    </tr>
    <tr>
      <td>Acme Ltd</td>
      <td>Las Vegas</td>
      <td>Nevada</td>
      <td></td>
      <td></td>
      <td></td>
      <td>Jim</td>
    </tr>
    <tr>
      <td>XYZ Inc</td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>
```

|name|address/city|address/state|orders/id|orders/shipments/id|orders/orderedAt|contacts|
|---|---|---|---|---|---|--- |
|ABC Co|Las Angeles||SO3|INV3|||
|Acme Ltd|Las Vegas|Nevada|SO2||2000-01-01||
|Acme Ltd|Las Vegas|Nevada|SO1|INV1|||
|Acme Ltd|Las Vegas|Nevada|SO1|INV2|||
|Acme Ltd|Las Vegas|Nevada||||Jim|
|Acme Ltd|Las Vegas|Nevada||||Johanna|
|XYZ Inc|||||| |
