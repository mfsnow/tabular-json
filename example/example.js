(function () {
  "use strict";

  var tabular = require('../lib/tabular');

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
  console.log("sult = tabular.flatten(obj, opts):\n", result, "\n");

  opts = {
    sort: "Name"
  };

  result = tabular.array(obj, opts);
  console.log("tabular.array(obj, opts):\n", result, "\n");

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
  console.log("tabular.array(customers):\n", result, "\n");

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
  console.log("tabular.delimit(obj, opts):\n", result, "\n");

  opts = {
    dot: "/",
    separator: '  ',
    dateFormatter: function(date) {return date.toISOString().substr(0,10);},
    sort: ["name", "address/state", "address/city", "-contacts"],
    classes: {table: "table table-striped table-bordered"}
  };

  result = tabular.html(customers, opts);
  console.log("tabular.html(customers, opts):\n", result, "\n");


})();
