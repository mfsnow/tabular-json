(function () {
  "use strict";

  var tabular = require("../lib/tabular");

  require("should");

  describe("tabular", function () {
    describe("array", function () {
      it("should return an empty array with no object", function () {
        var res = tabular.array();
        res.should.be.empty();
      });

      it("should return an empty array with an empty object", function () {
        var res = tabular.array({});
        res.should.be.empty();
      });

      it("should correctly parse single object", function () {
        var res = tabular.array({
          name: "John",
          age: 35
        });
        res.should.deepEqual([
          ["name", "age"],
          ["John", 35]
        ]);
      });
      it("should correctly parse an array", function () {
        var res = tabular.array([{
          name: "John",
          age: 35
        }, {
          name: "Jane",
          age: 36
        }]);
        res.should.deepEqual([
          ["name", "age"],
          ["John", 35],
          ["Jane", 36]
        ]);
      });
      it("should use null for empty properties", function () {
        var res = tabular.array([{
          name: "John",
          age: 35
        }, {
          name: "Jane"
        }]);
        res.should.deepEqual([
          ["name", "age"],
          ["John", 35],
          ["Jane", null]
        ]);
        tabular.array({
          name: null
        }).should.deepEqual([
          ["name"],
          [null]
        ]);
      });
      it("should handle sub-objects", function () {
        var res = tabular.array([{
          name: "John",
          age: 35
        }, {
          name: "Jane",
          address: {
            city: "Tokyo"
          }
        }]);
        res.should.deepEqual([
          ["name", "age", "address.city"],
          ["John", 35, null],
          ["Jane", null, "Tokyo"]
        ]);
      });
      it("should sort", function () {
        var res = tabular.array([{
          name: "John",
          age: 35,
          eyes: "brown"
        }, {
          name: "Jane",
          age: 32,
          eyes: "blue"
        }, {
          name: "Jordan",
          age: 32,
          eyes: "green"
        }], {
          sort: ["age", "-name"]
        });
        res.should.deepEqual([
          ["name", "age", "eyes"],
          ["Jordan", 32, "green"],
          ["Jane", 32, "blue"],
          ["John", 35, "brown"]
        ]);
      });

      it("should handle sub-arrays", function () {
        var res = tabular.array([{
          name: "John",
          age: 35,
          emails: [
            "john@example.com",
            "j.doe@example.com"
          ]
        }, {
          name: "Jane",
          address: {
            city: "Tokyo"
          }, emails: [
            "jane@example.com"
          ]
        }], {
          sort: ["name", "emails"]
        });
        res.should.deepEqual([
          ["name", "age", "emails", "address.city"],
          ["Jane", null, "jane@example.com", "Tokyo"],
          ["John", 35, "j.doe@example.com", null],
          ["John", 35, "john@example.com", null]
        ]);
      });
      it("should handle complex objects", function () {
        var res = tabular.array([{
          name: "John",
          addresses: [{
            city: "Hong Kong",
            phoneNumbers: ["555-555-5555", "888-888-8888"],
            emails: ["john@example.com", "j.doe@example.com"]
          }, {
            city: "Toronto",
            country: "Canada"
          }]
        }, {
          name: "Jane",
          addresses: [{
            city: "Tokyo"
          }]
        }], {
          sort: ["name", "-addresses.city", "addresses.phoneNumbers", "addresses.emails"]
        });
        res.should.deepEqual([
          ["name", "addresses.city", "addresses.phoneNumbers", "addresses.emails", "addresses.country"],
          ["Jane", "Tokyo", null, null, null],
          ["John", "Toronto", null, null, "Canada"],
          ["John", "Hong Kong", "555-555-5555", null, null],
          ["John", "Hong Kong", "888-888-8888", null, null],
          ["John", "Hong Kong", null, "j.doe@example.com", null],
          ["John", "Hong Kong", null, "john@example.com", null]
        ]);
      });

      it("should filter headers", function () {
        var res = tabular.array([{
          name: "John",
          addresses: [{
            city: "Hong Kong",
            phoneNumbers: [
              "555-555-5555",
              "888-888-8888"
            ],
            emails: [
              "john@example.com",
              "j.doe@example.com"
            ]
          }, {
            city: "Toronto",
            country: "Canada"
          }]
        }, {
          name: "Jane",
          addresses: [{
            city: "Tokyo"
          }]
        }], {
          headers: ["name", "addresses.city"],
          sort: ["name", "-addresses.city"]
        });
        res.should.deepEqual([
          ["name", "addresses.city"],
          ["Jane", "Tokyo"],
          ["John", "Toronto"],
          ["John", "Hong Kong"],
        ]);
      });

      it("should optionally exclude headers", function () {
        var res = tabular.array({
          name: "John",
          age: 35
        }, {
          includeHeaders: false
        });
        res.should.deepEqual([
          ["John", 35],
        ]);
      });
      it("should optionally change dot for sub-objects", function () {
        var res = tabular.array({
          name: "John",
          address: {
            city: "Tokyo"
          }
        }, {
          dot: "/"
        });
        res.should.have.property(0, ["name", "address/city"]);
      });
    });

    describe("flatten", function () {
      it("should return an empty array with no object, or an empty object", function () {
        tabular.flatten({}).should.be.empty();
        tabular.flatten().should.be.empty();
      });
      it("should flatten object flat", function () {
        var res = tabular.flatten({
          name: "John",
          address: {
            city: "Tokyo"
          }
        });
        res.should.deepEqual([{
          "name": "John",
          "address.city": "Tokyo"
        }]);
      });
    });
    describe("csv", function () {
      it("should return a string", function () {
        var res = tabular.delimit([{
          name: "John",
          age: 35
        }, {
          name: "Jane",
          age: 30
        }]);
        res.should.be.exactly('"name","age"\n"John",35\n"Jane",30\n');
      });
      it("should double quotes when within a string", function () {
        var res = tabular.delimit({
          name: "John",
          quote: "\"Hello, world!\""
        });
        res.should.be.exactly('"name","quote"\n"John","""Hello, world!"""\n');
      });
      it("should allow other string wraps, with custom escapes", function () {
        var res = tabular.delimit({
          first: "John",
          last: "Mc'Coy"
        }, {
          stringWrap: "'"
        });
        res.should.be.exactly('\'first\',\'last\'\n\'John\',\'Mc\'\'Coy\'\n');
        res = tabular.delimit({
          first: "John",
          last: "Mc'Coy"
        }, {
          stringWrap: "'", escape: '\\'
        });
        res.should.be.exactly('\'first\',\'last\'\n\'John\',\'Mc\\\'Coy\'\n');
        res = tabular.delimit({
          first: "John",
          last: "Mc'Coy"
        }, {
          stringWrap: "'", escape: function(str, wrap) {return str.replace(/Mc\'/g, 'Mac');}
        });
        res.should.be.exactly('\'first\',\'last\'\n\'John\',\'MacCoy\'\n');
      });
      it("should allow other EOLs", function () {
        var res = tabular.delimit({
          first: "John",
          last: "McCoy"
        }, {
          eol: "\t"
        });
        res.should.be.exactly('"first","last"\t"John","McCoy"\t');
      });
      it("should allow other separators", function () {
        var res = tabular.delimit({
          first: "John",
          last: "McCoy"
        }, {
          separator: "\t"
        });
        res.should.be.exactly('"first"\t"last"\n"John"\t"McCoy"\n');
      });
      it("should format dates", function () {
        var date = new Date();
        tabular.delimit({
          first: "John",
          createdAt: date
        }).should.be.exactly('"first","createdAt"\n"John",' + date.toLocaleDateString() + '\n');
        var formatter = function (date) {
          return date.getDate();
        };
        tabular.delimit({
          first: "John",
          createdAt: date
        }, {
          dateFormatter: formatter
        }).should.be.exactly('"first","createdAt"\n"John",' + formatter(date) + '\n');
      });
      it("should remove carriage returns", function() {
        var res = tabular.delimit({memo: "Memo\nwith multiple lines\non it."});
        res.should.be.exactly('"memo"\n"Memo with multiple lines on it."\n');
      });
    });
    describe("html", function () {
      it("should provide an html string", function () {
        var res = tabular.html([{
          "First Name": "John",
          "Last Name": "Doe"
        }, {
          "First Name": "Jane",
          "Last Name": "Doe"
        }]);
        res.should.be.exactly('<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>First Name</th>\n\t\t\t<th>Last Name</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>John</td>\n\t\t\t<td>Doe</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>Jane</td>\n\t\t\t<td>Doe</td>\n\t\t</tr>\n\t</tbody>\n</table>\n');
      });
      it("should encode strings", function() {
        var res = tabular.html({
          cell: '<span>I\'m a span</span>'
        });
        res.should.be.exactly('<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>cell</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>&lt;span&gt;I\'m a span&lt;/span&gt;</td>\n\t\t</tr>\n\t</tbody>\n</table>\n');
      });
    });
  });

}());
