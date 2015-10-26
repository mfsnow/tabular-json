var tabular = require('./lib/tabular');
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
var opts = {
  dot: "/",
  separator: '  ',
  dateFormatter: function(date) {return date.toISOString().substr(0,10);},
  sort: ["name", "address/state", "address/city", "-contacts"],
  classes: {
    table: "table table-striped table-bordered"
  }
}
var result = tabular.html(customers, opts);
console.log(result);
