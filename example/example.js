(function () {
  "use strict";

  var tabular = require('../lib/tabular');

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
        { id: "SO2", orderedAt: new Date()}
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

  var arr = tabular.array(customers);
  console.log("Array", arr);

  arr = tabular.array(customers, {headers: ["name", "orders.shipments.id"]});
  console.log("Array", arr);

  arr = tabular.array(customers, {headers: ["name", "orders.shipments.id"], sort: ["name", "-orders.shipments.id"]});
  console.log("Array", arr);

  var flat = tabular.flatten(customers, {headers: ["name", "orders.shipments.id"]});
  console.log("Flat", flat);
})();
