# tabular
Flatten complex JSON objects and convert to csv, tab delimited, or html

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

//
// arr
//
//[
//  [ 'name', 'address.city', 'address.state', 'orders.id', 'orders.shipments.id', 'orders.orderedAt', 'contacts' ],
//  [ 'XYZ Inc', null, null, null, null, null, null ],
//  [ 'Acme Ltd','Las Vegas','Nevada','SO2',null,Sat Oct 24 2015 01:04:39 GMT-0400 (EDT),null ],
//  [ 'Acme Ltd', 'Las Vegas', 'Nevada', 'SO1', 'INV1', null, null ],
//  [ 'Acme Ltd', 'Las Vegas', 'Nevada', 'SO1', 'INV2', null, null ],
//  [ 'ABC Co', 'Las Angeles', null, 'SO3', 'INV3', null, null ],
//  [ 'Acme Ltd', 'Las Vegas', 'Nevada', null, null, null, 'Jim' ],
//  [ 'Acme Ltd', 'Las Vegas', 'Nevada', null, null, null, 'Johanna' ]
//]
```

```js
  var html = tabular.html(customers);
```
```html
<table>
	<thead>
		<tr>
			<th>name</th>
			<th>address city</th>
			<th>address state</th>
			<th>orders id</th>
			<th>orders shipments id</th>
			<th>orders orderedAt</th>
			<th>contacts</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>XYZ Inc</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
		</tr>
		<tr>
			<td>Acme Ltd</td>
			<td>Las Vegas</td>
			<td>Nevada</td>
			<td>SO2</td>
			<td>null</td>
			<td>10/24/2015</td>
			<td>null</td>
		</tr>
		<tr>
			<td>Acme Ltd</td>
			<td>Las Vegas</td>
			<td>Nevada</td>
			<td>SO1</td>
			<td>INV1</td>
			<td>null</td>
			<td>null</td>
		</tr>
		<tr>
			<td>Acme Ltd</td>
			<td>Las Vegas</td>
			<td>Nevada</td>
			<td>SO1</td>
			<td>INV2</td>
			<td>null</td>
			<td>null</td>
		</tr>
		<tr>
			<td>ABC Co</td>
			<td>Las Angeles</td>
			<td>null</td>
			<td>SO3</td>
			<td>INV3</td>
			<td>null</td>
			<td>null</td>
		</tr>
		<tr>
			<td>Acme Ltd</td>
			<td>Las Vegas</td>
			<td>Nevada</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
			<td>Jim</td>
		</tr>
		<tr>
			<td>Acme Ltd</td>
			<td>Las Vegas</td>
			<td>Nevada</td>
			<td>null</td>
			<td>null</td>
			<td>null</td>
			<td>Johanna</td>
		</tr>
	</tbody>
</table>
```

|name|address.city|address.state|orders.id|orders.shipments.id|orders.orderedAt|contacts|
|---|---|---|---|---|---|--- |
|XYZ Inc|||||| |
|Acme Ltd|Las Vegas|Nevada|SO2||10/24/2015||
|Acme Ltd|Las Vegas|Nevada|SO1|INV1|||
|Acme Ltd|Las Vegas|Nevada|SO1|INV2|||
|ABC Co|Las Angeles||SO3|INV3|||
|Acme Ltd|Las Vegas|Nevada||||Jim|
|Acme Ltd|Las Vegas|Nevada||||Johanna|
