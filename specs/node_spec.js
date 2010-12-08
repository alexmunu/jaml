require("./spec_helper.js");

describe("Jaml.Node", function() {
  
  beforeEach(function(){
    fooBar = new Jaml.Node("fooBar");
  });
  
  describe("tag closing", function() {
    it("self-closes by default", function(){
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render());
    });

    it("doesn't self-close for (for example) textarea", function(){
      assert.equal("<textarea></textarea>\n", new Jaml.Node("textarea").render());
    });
    
    it("doesn't self-close if there are children", function(){
      assert.equal("<fooBar>\n" +
                   "  <x/>\n" +
                   "</fooBar>\n", new Jaml.Node("fooBar").addChild(new Jaml.Node("x")).render());
    });
    
    it("doesn't self-close if there are text nodes", function(){
      assert.equal("<fooBar>x</fooBar>\n", new Jaml.Node("fooBar").addChild(new Jaml.TextNode("x")).render());
    });
    
  });
  
  describe("padding of spaces at the front", function() {
    it("properly prepends the specified amount of left padding", function(){
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render());
      assert.equal("<fooBar/>\n", new Jaml.Node("fooBar").render(0));
      assert.equal("     <fooBar/>\n", new Jaml.Node("fooBar").render(5));
    });

    it("indents children by 2", function(){
      assert.equal("<fooBar>\n" +
                   "  <x>\n" + 
                   "    <y/>\n" +
                   "  </x>\n" +
                   "</fooBar>\n", 
                   new Jaml.Node("fooBar").
                     addChild(
                       new Jaml.Node("x").
                         addChild(new Jaml.Node("y"))
                     ).render());
    });
  });
  
  describe("attributes", function() {
    it("renders attributes as key value pairs separated by = in the tag", function(){
      assert.equal("<fooBar a=\"b\"/>\n", fooBar.setAttributes({a:"b"}).render());
    });

    it("renders several attributes in a row.  order is imposed", function(){
      assert.equal("<fooBar a=\"b\" c=\"d\" x=\"y\"/>\n", fooBar.setAttributes({x:"y", a:"b", c:"d"}).render());
    });

    it("renders booleans", function(){
      assert.equal("<fooBar a=\"true\"/>\n", fooBar.setAttributes({a:true}).render());
      assert.equal("<fooBar a=\"false\"/>\n", fooBar.setAttributes({a:false}).render());
    });

    it("renders integers", function(){
      assert.equal("<fooBar a=\"0\"/>\n", fooBar.setAttributes({a:0}).render());
      assert.equal("<fooBar a=\"-1\"/>\n", fooBar.setAttributes({a:-1}).render());
      assert.equal("<fooBar a=\"7\"/>\n", fooBar.setAttributes({a:7}).render());
    });
    
    it("renders floats", function(){
      assert.equal("<fooBar a=\"0\"/>\n", fooBar.setAttributes({a:0.0}).render());
      
      assert.equal("<fooBar a=\"0.01\"/>\n", fooBar.setAttributes({a:0.01}).render());
      assert.equal("<fooBar a=\"0.01\"/>\n", fooBar.setAttributes({a:0.0100}).render());
      
      assert.equal("<fooBar a=\"23.45\"/>\n", fooBar.setAttributes({a:23.45}).render());
      assert.equal("<fooBar a=\"-23.45\"/>\n", fooBar.setAttributes({a:-23.45}).render());
    });
    
    it("does the javascript thing on really big and really small numbers.  just calling this out.", function(){
      assert.equal("<fooBar a=\"7e+22\"/>\n", fooBar.setAttributes({a:70000000000000000000000}).render());
      assert.equal("<fooBar a=\"7e+22\"/>\n", fooBar.setAttributes({a:70000000000000000000000.01}).render());
      
      assert.equal("<fooBar a=\"7e-23\"/>\n", fooBar.setAttributes({a:0.00000000000000000000007}).render());
    });
    
    //todo: throw if the attribute value is a non-primitive?
  });
  
  describe("element children", function() {
    it("renders children as inner tags", function(){
      assert.equal("<fooBar>\n" +
                   "  <x/>\n" +
                   "</fooBar>\n", fooBar.addChild(new Jaml.Node("x")).render());
    });

    it("renders multiple children in order", function(){
      assert.equal("<fooBar>\n" +
                   "  <x/>\n" +
                   "  <y/>\n" +
                   "  <z/>\n" +
                   "</fooBar>\n", 
                   fooBar.addChild(new Jaml.Node("x")).
                          addChild(new Jaml.Node("y")).
                          addChild(new Jaml.Node("z")).render());
    });

    it("renders children of children", function(){
      assert.equal("<fooBar>\n" +
                   "  <x>\n" +
                   "    <J/>\n" +
                   "  </x>\n" +
                   "  <y>\n" +
                   "    <K/>\n" +
                   "  </y>\n" +
                   "</fooBar>\n", 
                   fooBar.addChild(new Jaml.Node("x").addChild(new Jaml.Node("J"))).
                          addChild(new Jaml.Node("y").addChild(new Jaml.Node("K"))).render());
    });
  });
  
  describe("textnodes", function() {
    it("renders", function(){
      assert.equal("x", new Jaml.TextNode("x").render());
    });

    it("renders a single textnode child all on one line", function(){
      assert.equal("<fooBar>x</fooBar>\n", new Jaml.Node("fooBar").addChild(new Jaml.TextNode("x")).render());
    });

    it("renders text nodes in one line, on a new line if there are multiple textnode children", function(){
      assert.equal("<fooBar>\nxy</fooBar>\n", fooBar.addChild(new Jaml.TextNode("x")).
                                                     addChild(new Jaml.TextNode("y")).render());
    });
  });
});

