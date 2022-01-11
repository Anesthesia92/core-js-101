
/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = Object.create(proto);
  Object.assign(obj, JSON.parse(json));
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  ElementSelector: class {
    constructor() {
      this.selector = '';
    }

    element(value) {
      const res = /^\w/;
      const selectors = /#|\.|\[|\]|:/;
      if (res.test(this.selector)) throw new Error('Not implemented');
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += value;
      return this;
    }

    id(value) {
      const hash = /#/;
      const selectors = /\.|\[|\]|:/;
      if (hash.test(this.selector)) throw new Error('Not implemented');
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += `#${value}`;
      return this;
    }

    class(value) {
      const selectors = /\[|\]|:/;
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += `.${value}`;
      return this;
    }

    attr(value) {
      const selectors = /:/;
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += `[${value}]`;
      return this;
    }

    pseudoClass(value) {
      const selectors = /::/;
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += `:${value}`;
      return this;
    }

    pseudoElement(value) {
      const selectors = /::/;
      if (selectors.test(this.selector)) throw new Error('Not implemented');
      this.selector += `::${value}`;
      return this;
    }

    stringify() {
      return this.selector;
    }
  },

  element(value) {
    return new this.ElementSelector().element(value);
  },

  id(value) {
    return new this.ElementSelector().id(value);
  },

  class(value) {
    return new this.ElementSelector().class(value);
  },

  attr(value) {
    return new this.ElementSelector().attr(value);
  },

  pseudoClass(value) {
    return new this.ElementSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new this.ElementSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify() {
        return `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
      },
    };
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
