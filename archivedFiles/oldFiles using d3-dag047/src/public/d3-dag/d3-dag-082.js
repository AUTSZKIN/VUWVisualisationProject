// d3-dag Version 0.8.2. Copyright 2021 Erik Brinkman.
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __require = (x) => {
  if (typeof require !== "undefined")
    return require(x);
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __reExport = (target, module, desc) => {
  if (module && typeof module === "object" || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module) => {
  return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
};

// node_modules/denque/index.js
var require_denque = __commonJS({
  "node_modules/denque/index.js"(exports, module) {
    "use strict";
    function Denque2(array, options) {
      var options = options || {};
      this._head = 0;
      this._tail = 0;
      this._capacity = options.capacity;
      this._capacityMask = 3;
      this._list = new Array(4);
      if (Array.isArray(array)) {
        this._fromArray(array);
      }
    }
    Denque2.prototype.peekAt = function peekAt(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var len = this.size();
      if (i >= len || i < -len)
        return void 0;
      if (i < 0)
        i += len;
      i = this._head + i & this._capacityMask;
      return this._list[i];
    };
    Denque2.prototype.get = function get(i) {
      return this.peekAt(i);
    };
    Denque2.prototype.peek = function peek() {
      if (this._head === this._tail)
        return void 0;
      return this._list[this._head];
    };
    Denque2.prototype.peekFront = function peekFront() {
      return this.peek();
    };
    Denque2.prototype.peekBack = function peekBack() {
      return this.peekAt(-1);
    };
    Object.defineProperty(Denque2.prototype, "length", {
      get: function length() {
        return this.size();
      }
    });
    Denque2.prototype.size = function size() {
      if (this._head === this._tail)
        return 0;
      if (this._head < this._tail)
        return this._tail - this._head;
      else
        return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque2.prototype.unshift = function unshift(item) {
      if (item === void 0)
        return this.size();
      var len = this._list.length;
      this._head = this._head - 1 + len & this._capacityMask;
      this._list[this._head] = item;
      if (this._tail === this._head)
        this._growArray();
      if (this._capacity && this.size() > this._capacity)
        this.pop();
      if (this._head < this._tail)
        return this._tail - this._head;
      else
        return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque2.prototype.shift = function shift() {
      var head = this._head;
      if (head === this._tail)
        return void 0;
      var item = this._list[head];
      this._list[head] = void 0;
      this._head = head + 1 & this._capacityMask;
      if (head < 2 && this._tail > 1e4 && this._tail <= this._list.length >>> 2)
        this._shrinkArray();
      return item;
    };
    Denque2.prototype.push = function push(item) {
      if (item === void 0)
        return this.size();
      var tail = this._tail;
      this._list[tail] = item;
      this._tail = tail + 1 & this._capacityMask;
      if (this._tail === this._head) {
        this._growArray();
      }
      if (this._capacity && this.size() > this._capacity) {
        this.shift();
      }
      if (this._head < this._tail)
        return this._tail - this._head;
      else
        return this._capacityMask + 1 - (this._head - this._tail);
    };
    Denque2.prototype.pop = function pop() {
      var tail = this._tail;
      if (tail === this._head)
        return void 0;
      var len = this._list.length;
      this._tail = tail - 1 + len & this._capacityMask;
      var item = this._list[this._tail];
      this._list[this._tail] = void 0;
      if (this._head < 2 && tail > 1e4 && tail <= len >>> 2)
        this._shrinkArray();
      return item;
    };
    Denque2.prototype.removeOne = function removeOne(index) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail)
        return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size)
        return void 0;
      if (i < 0)
        i += size;
      i = this._head + i & this._capacityMask;
      var item = this._list[i];
      var k;
      if (index < size / 2) {
        for (k = index; k > 0; k--) {
          this._list[i] = this._list[i = i - 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._head = this._head + 1 + len & this._capacityMask;
      } else {
        for (k = size - 1 - index; k > 0; k--) {
          this._list[i] = this._list[i = i + 1 + len & this._capacityMask];
        }
        this._list[i] = void 0;
        this._tail = this._tail - 1 + len & this._capacityMask;
      }
      return item;
    };
    Denque2.prototype.remove = function remove(index, count) {
      var i = index;
      var removed;
      var del_count = count;
      if (i !== (i | 0)) {
        return void 0;
      }
      if (this._head === this._tail)
        return void 0;
      var size = this.size();
      var len = this._list.length;
      if (i >= size || i < -size || count < 1)
        return void 0;
      if (i < 0)
        i += size;
      if (count === 1 || !count) {
        removed = new Array(1);
        removed[0] = this.removeOne(i);
        return removed;
      }
      if (i === 0 && i + count >= size) {
        removed = this.toArray();
        this.clear();
        return removed;
      }
      if (i + count > size)
        count = size - i;
      var k;
      removed = new Array(count);
      for (k = 0; k < count; k++) {
        removed[k] = this._list[this._head + i + k & this._capacityMask];
      }
      i = this._head + i & this._capacityMask;
      if (index + count === size) {
        this._tail = this._tail - count + len & this._capacityMask;
        for (k = count; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (index === 0) {
        this._head = this._head + count + len & this._capacityMask;
        for (k = count - 1; k > 0; k--) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
        }
        return removed;
      }
      if (i < size / 2) {
        this._head = this._head + index + count + len & this._capacityMask;
        for (k = index; k > 0; k--) {
          this.unshift(this._list[i = i - 1 + len & this._capacityMask]);
        }
        i = this._head - 1 + len & this._capacityMask;
        while (del_count > 0) {
          this._list[i = i - 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
        if (index < 0)
          this._tail = i;
      } else {
        this._tail = i;
        i = i + count + len & this._capacityMask;
        for (k = size - (count + index); k > 0; k--) {
          this.push(this._list[i++]);
        }
        i = this._tail;
        while (del_count > 0) {
          this._list[i = i + 1 + len & this._capacityMask] = void 0;
          del_count--;
        }
      }
      if (this._head < 2 && this._tail > 1e4 && this._tail <= len >>> 2)
        this._shrinkArray();
      return removed;
    };
    Denque2.prototype.splice = function splice(index, count) {
      var i = index;
      if (i !== (i | 0)) {
        return void 0;
      }
      var size = this.size();
      if (i < 0)
        i += size;
      if (i > size)
        return void 0;
      if (arguments.length > 2) {
        var k;
        var temp;
        var removed;
        var arg_len = arguments.length;
        var len = this._list.length;
        var arguments_index = 2;
        if (!size || i < size / 2) {
          temp = new Array(i);
          for (k = 0; k < i; k++) {
            temp[k] = this._list[this._head + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i > 0) {
              this._head = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._head = this._head + i + len & this._capacityMask;
          }
          while (arg_len > arguments_index) {
            this.unshift(arguments[--arg_len]);
          }
          for (k = i; k > 0; k--) {
            this.unshift(temp[k - 1]);
          }
        } else {
          temp = new Array(size - (i + count));
          var leng = temp.length;
          for (k = 0; k < leng; k++) {
            temp[k] = this._list[this._head + i + count + k & this._capacityMask];
          }
          if (count === 0) {
            removed = [];
            if (i != size) {
              this._tail = this._head + i + len & this._capacityMask;
            }
          } else {
            removed = this.remove(i, count);
            this._tail = this._tail - leng + len & this._capacityMask;
          }
          while (arguments_index < arg_len) {
            this.push(arguments[arguments_index++]);
          }
          for (k = 0; k < leng; k++) {
            this.push(temp[k]);
          }
        }
        return removed;
      } else {
        return this.remove(i, count);
      }
    };
    Denque2.prototype.clear = function clear() {
      this._head = 0;
      this._tail = 0;
    };
    Denque2.prototype.isEmpty = function isEmpty() {
      return this._head === this._tail;
    };
    Denque2.prototype.toArray = function toArray() {
      return this._copyArray(false);
    };
    Denque2.prototype._fromArray = function _fromArray(array) {
      for (var i = 0; i < array.length; i++)
        this.push(array[i]);
    };
    Denque2.prototype._copyArray = function _copyArray(fullCopy) {
      var newArray = [];
      var list = this._list;
      var len = list.length;
      var i;
      if (fullCopy || this._head > this._tail) {
        for (i = this._head; i < len; i++)
          newArray.push(list[i]);
        for (i = 0; i < this._tail; i++)
          newArray.push(list[i]);
      } else {
        for (i = this._head; i < this._tail; i++)
          newArray.push(list[i]);
      }
      return newArray;
    };
    Denque2.prototype._growArray = function _growArray() {
      if (this._head) {
        this._list = this._copyArray(true);
        this._head = 0;
      }
      this._tail = this._list.length;
      this._list.length *= 2;
      this._capacityMask = this._capacityMask << 1 | 1;
    };
    Denque2.prototype._shrinkArray = function _shrinkArray() {
      this._list.length >>>= 1;
      this._capacityMask >>>= 1;
    };
    module.exports = Denque2;
  }
});

// node_modules/quadprog/lib/vsmall.js
var require_vsmall = __commonJS({
  "node_modules/quadprog/lib/vsmall.js"(exports, module) {
    "use strict";
    var epsilon = 1e-60;
    var tmpa;
    var tmpb;
    do {
      epsilon += epsilon;
      tmpa = 1 + 0.1 * epsilon;
      tmpb = 1 + 0.2 * epsilon;
    } while (tmpa <= 1 || tmpb <= 1);
    module.exports = epsilon;
  }
});

// node_modules/quadprog/lib/dpori.js
var require_dpori = __commonJS({
  "node_modules/quadprog/lib/dpori.js"(exports, module) {
    "use strict";
    function dpori(a, lda, n) {
      let kp1, t;
      for (let k = 1; k <= n; k += 1) {
        a[k][k] = 1 / a[k][k];
        t = -a[k][k];
        for (let i = 1; i < k; i += 1) {
          a[i][k] *= t;
        }
        kp1 = k + 1;
        if (n < kp1) {
          break;
        }
        for (let j = kp1; j <= n; j += 1) {
          t = a[k][j];
          a[k][j] = 0;
          for (let i = 1; i <= k; i += 1) {
            a[i][j] += t * a[i][k];
          }
        }
      }
    }
    module.exports = dpori;
  }
});

// node_modules/quadprog/lib/dposl.js
var require_dposl = __commonJS({
  "node_modules/quadprog/lib/dposl.js"(exports, module) {
    "use strict";
    function dposl(a, lda, n, b) {
      let k, t;
      for (k = 1; k <= n; k += 1) {
        t = 0;
        for (let i = 1; i < k; i += 1) {
          t += a[i][k] * b[i];
        }
        b[k] = (b[k] - t) / a[k][k];
      }
      for (let kb = 1; kb <= n; kb += 1) {
        k = n + 1 - kb;
        b[k] /= a[k][k];
        t = -b[k];
        for (let i = 1; i < k; i += 1) {
          b[i] += t * a[i][k];
        }
      }
    }
    module.exports = dposl;
  }
});

// node_modules/quadprog/lib/dpofa.js
var require_dpofa = __commonJS({
  "node_modules/quadprog/lib/dpofa.js"(exports, module) {
    "use strict";
    function dpofa(a, lda, n, info) {
      let jm1, t, s;
      for (let j = 1; j <= n; j += 1) {
        info[1] = j;
        s = 0;
        jm1 = j - 1;
        if (jm1 < 1) {
          s = a[j][j] - s;
          if (s <= 0) {
            break;
          }
          a[j][j] = Math.sqrt(s);
        } else {
          for (let k = 1; k <= jm1; k += 1) {
            t = a[k][j];
            for (let i = 1; i < k; i += 1) {
              t -= a[i][j] * a[i][k];
            }
            t /= a[k][k];
            a[k][j] = t;
            s += t * t;
          }
          s = a[j][j] - s;
          if (s <= 0) {
            break;
          }
          a[j][j] = Math.sqrt(s);
        }
        info[1] = 0;
      }
    }
    module.exports = dpofa;
  }
});

// node_modules/quadprog/lib/qpgen2.js
var require_qpgen2 = __commonJS({
  "node_modules/quadprog/lib/qpgen2.js"(exports, module) {
    "use strict";
    var vsmall = require_vsmall();
    var dpori = require_dpori();
    var dposl = require_dposl();
    var dpofa = require_dpofa();
    function qpgen2(dmat, dvec, fddmat, n, sol, lagr, crval, amat, bvec, fdamat, q, meq, iact, nnact = 0, iter, work, ierr) {
      let l1, it1, nvl, nact, temp, sum, t1, tt, gc, gs, nu, t1inf, t2min, go;
      const r = Math.min(n, q);
      let l = 2 * n + r * (r + 5) / 2 + 2 * q + 1;
      for (let i = 1; i <= n; i += 1) {
        work[i] = dvec[i];
      }
      for (let i = n + 1; i <= l; i += 1) {
        work[i] = 0;
      }
      for (let i = 1; i <= q; i += 1) {
        iact[i] = 0;
        lagr[i] = 0;
      }
      const info = [];
      if (ierr[1] === 0) {
        dpofa(dmat, fddmat, n, info);
        if (info[1] !== 0) {
          ierr[1] = 2;
          return;
        }
        dposl(dmat, fddmat, n, dvec);
        dpori(dmat, fddmat, n);
      } else {
        for (let j = 1; j <= n; j += 1) {
          sol[j] = 0;
          for (let i = 1; i <= j; i += 1) {
            sol[j] += dmat[i][j] * dvec[i];
          }
        }
        for (let j = 1; j <= n; j += 1) {
          dvec[j] = 0;
          for (let i = j; i <= n; i += 1) {
            dvec[j] += dmat[j][i] * sol[i];
          }
        }
      }
      crval[1] = 0;
      for (let j = 1; j <= n; j += 1) {
        sol[j] = dvec[j];
        crval[1] += work[j] * sol[j];
        work[j] = 0;
        for (let i = j + 1; i <= n; i += 1) {
          dmat[i][j] = 0;
        }
      }
      crval[1] = -crval[1] / 2;
      ierr[1] = 0;
      const iwzv = n;
      const iwrv = iwzv + n;
      const iwuv = iwrv + r;
      const iwrm = iwuv + r + 1;
      const iwsv = iwrm + r * (r + 1) / 2;
      const iwnbv = iwsv + q;
      for (let i = 1; i <= q; i += 1) {
        sum = 0;
        for (let j = 1; j <= n; j += 1) {
          sum += amat[j][i] * amat[j][i];
        }
        work[iwnbv + i] = Math.sqrt(sum);
      }
      nact = nnact;
      iter[1] = 0;
      iter[2] = 0;
      function fnGoto50() {
        iter[1] += 1;
        l = iwsv;
        for (let i = 1; i <= q; i += 1) {
          l += 1;
          sum = -bvec[i];
          for (let j = 1; j <= n; j += 1) {
            sum += amat[j][i] * sol[j];
          }
          if (Math.abs(sum) < vsmall) {
            sum = 0;
          }
          if (i > meq) {
            work[l] = sum;
          } else {
            work[l] = -Math.abs(sum);
            if (sum > 0) {
              for (let j = 1; j <= n; j += 1) {
                amat[j][i] = -amat[j][i];
              }
              bvec[i] = -bvec[i];
            }
          }
        }
        for (let i = 1; i <= nact; i += 1) {
          work[iwsv + iact[i]] = 0;
        }
        nvl = 0;
        temp = 0;
        for (let i = 1; i <= q; i += 1) {
          if (work[iwsv + i] < temp * work[iwnbv + i]) {
            nvl = i;
            temp = work[iwsv + i] / work[iwnbv + i];
          }
        }
        if (nvl === 0) {
          for (let i = 1; i <= nact; i += 1) {
            lagr[iact[i]] = work[iwuv + i];
          }
          return 999;
        }
        return 0;
      }
      function fnGoto55() {
        for (let i = 1; i <= n; i += 1) {
          sum = 0;
          for (let j = 1; j <= n; j += 1) {
            sum += dmat[j][i] * amat[j][nvl];
          }
          work[i] = sum;
        }
        l1 = iwzv;
        for (let i = 1; i <= n; i += 1) {
          work[l1 + i] = 0;
        }
        for (let j = nact + 1; j <= n; j += 1) {
          for (let i = 1; i <= n; i += 1) {
            work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
          }
        }
        t1inf = true;
        for (let i = nact; i >= 1; i -= 1) {
          sum = work[i];
          l = iwrm + i * (i + 3) / 2;
          l1 = l - i;
          for (let j = i + 1; j <= nact; j += 1) {
            sum -= work[l] * work[iwrv + j];
            l += j;
          }
          sum /= work[l1];
          work[iwrv + i] = sum;
          if (iact[i] <= meq) {
            continue;
          }
          if (sum <= 0) {
            continue;
          }
          t1inf = false;
          it1 = i;
        }
        if (!t1inf) {
          t1 = work[iwuv + it1] / work[iwrv + it1];
          for (let i = 1; i <= nact; i += 1) {
            if (iact[i] <= meq) {
              continue;
            }
            if (work[iwrv + i] <= 0) {
              continue;
            }
            temp = work[iwuv + i] / work[iwrv + i];
            if (temp < t1) {
              t1 = temp;
              it1 = i;
            }
          }
        }
        sum = 0;
        for (let i = iwzv + 1; i <= iwzv + n; i += 1) {
          sum += work[i] * work[i];
        }
        if (Math.abs(sum) <= vsmall) {
          if (t1inf) {
            ierr[1] = 1;
            return 999;
          }
          for (let i = 1; i <= nact; i += 1) {
            work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
          }
          work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1;
          return 700;
        }
        sum = 0;
        for (let i = 1; i <= n; i += 1) {
          sum += work[iwzv + i] * amat[i][nvl];
        }
        tt = -work[iwsv + nvl] / sum;
        t2min = true;
        if (!t1inf) {
          if (t1 < tt) {
            tt = t1;
            t2min = false;
          }
        }
        for (let i = 1; i <= n; i += 1) {
          sol[i] += tt * work[iwzv + i];
          if (Math.abs(sol[i]) < vsmall) {
            sol[i] = 0;
          }
        }
        crval[1] += tt * sum * (tt / 2 + work[iwuv + nact + 1]);
        for (let i = 1; i <= nact; i += 1) {
          work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
        }
        work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;
        if (t2min) {
          nact += 1;
          iact[nact] = nvl;
          l = iwrm + (nact - 1) * nact / 2 + 1;
          for (let i = 1; i <= nact - 1; i += 1) {
            work[l] = work[i];
            l += 1;
          }
          if (nact === n) {
            work[l] = work[n];
          } else {
            for (let i = n; i >= nact + 1; i -= 1) {
              if (work[i] === 0) {
                continue;
              }
              gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
              gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));
              if (work[i - 1] >= 0) {
                temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
              } else {
                temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
              }
              gc = work[i - 1] / temp;
              gs = work[i] / temp;
              if (gc === 1) {
                continue;
              }
              if (gc === 0) {
                work[i - 1] = gs * temp;
                for (let j = 1; j <= n; j += 1) {
                  temp = dmat[j][i - 1];
                  dmat[j][i - 1] = dmat[j][i];
                  dmat[j][i] = temp;
                }
              } else {
                work[i - 1] = temp;
                nu = gs / (1 + gc);
                for (let j = 1; j <= n; j += 1) {
                  temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
                  dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
                  dmat[j][i - 1] = temp;
                }
              }
            }
            work[l] = work[nact];
          }
        } else {
          sum = -bvec[nvl];
          for (let j = 1; j <= n; j += 1) {
            sum += sol[j] * amat[j][nvl];
          }
          if (nvl > meq) {
            work[iwsv + nvl] = sum;
          } else {
            work[iwsv + nvl] = -Math.abs(sum);
            if (sum > 0) {
              for (let j = 1; j <= n; j += 1) {
                amat[j][nvl] = -amat[j][nvl];
              }
              bvec[nvl] = -bvec[nvl];
            }
          }
          return 700;
        }
        return 0;
      }
      function fnGoto797() {
        l = iwrm + it1 * (it1 + 1) / 2 + 1;
        l1 = l + it1;
        if (work[l1] === 0) {
          return 798;
        }
        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
        if (work[l1 - 1] >= 0) {
          temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        } else {
          temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
        }
        gc = work[l1 - 1] / temp;
        gs = work[l1] / temp;
        if (gc === 1) {
          return 798;
        }
        if (gc === 0) {
          for (let i = it1 + 1; i <= nact; i += 1) {
            temp = work[l1 - 1];
            work[l1 - 1] = work[l1];
            work[l1] = temp;
            l1 += i;
          }
          for (let i = 1; i <= n; i += 1) {
            temp = dmat[i][it1];
            dmat[i][it1] = dmat[i][it1 + 1];
            dmat[i][it1 + 1] = temp;
          }
        } else {
          nu = gs / (1 + gc);
          for (let i = it1 + 1; i <= nact; i += 1) {
            temp = gc * work[l1 - 1] + gs * work[l1];
            work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
            work[l1 - 1] = temp;
            l1 += i;
          }
          for (let i = 1; i <= n; i += 1) {
            temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
            dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
            dmat[i][it1] = temp;
          }
        }
        return 0;
      }
      function fnGoto798() {
        l1 = l - it1;
        for (let i = 1; i <= it1; i += 1) {
          work[l1] = work[l];
          l += 1;
          l1 += 1;
        }
        work[iwuv + it1] = work[iwuv + it1 + 1];
        iact[it1] = iact[it1 + 1];
        it1 += 1;
        if (it1 < nact) {
          return 797;
        }
        return 0;
      }
      function fnGoto799() {
        work[iwuv + nact] = work[iwuv + nact + 1];
        work[iwuv + nact + 1] = 0;
        iact[nact] = 0;
        nact -= 1;
        iter[2] += 1;
        return 0;
      }
      go = 0;
      while (true) {
        go = fnGoto50();
        if (go === 999) {
          return;
        }
        while (true) {
          go = fnGoto55();
          if (go === 0) {
            break;
          }
          if (go === 999) {
            return;
          }
          if (go === 700) {
            if (it1 === nact) {
              fnGoto799();
            } else {
              while (true) {
                fnGoto797();
                go = fnGoto798();
                if (go !== 797) {
                  break;
                }
              }
              fnGoto799();
            }
          }
        }
      }
    }
    module.exports = qpgen2;
  }
});

// node_modules/quadprog/lib/quadprog.js
var require_quadprog = __commonJS({
  "node_modules/quadprog/lib/quadprog.js"(exports) {
    "use strict";
    var qpgen2 = require_qpgen2();
    function solveQP2(Dmat, dvec, Amat, bvec = [], meq = 0, factorized = [0, 0]) {
      const crval = [];
      const iact = [];
      const sol = [];
      const lagr = [];
      const work = [];
      const iter = [];
      let message = "";
      const n = Dmat.length - 1;
      const q = Amat[1].length - 1;
      if (!bvec) {
        for (let i = 1; i <= q; i += 1) {
          bvec[i] = 0;
        }
      }
      if (n !== Dmat[1].length - 1) {
        message = "Dmat is not symmetric!";
      }
      if (n !== dvec.length - 1) {
        message = "Dmat and dvec are incompatible!";
      }
      if (n !== Amat.length - 1) {
        message = "Amat and dvec are incompatible!";
      }
      if (q !== bvec.length - 1) {
        message = "Amat and bvec are incompatible!";
      }
      if (meq > q || meq < 0) {
        message = "Value of meq is invalid!";
      }
      if (message !== "") {
        return {
          message
        };
      }
      for (let i = 1; i <= q; i += 1) {
        iact[i] = 0;
        lagr[i] = 0;
      }
      const nact = 0;
      const r = Math.min(n, q);
      for (let i = 1; i <= n; i += 1) {
        sol[i] = 0;
      }
      crval[1] = 0;
      for (let i = 1; i <= 2 * n + r * (r + 5) / 2 + 2 * q + 1; i += 1) {
        work[i] = 0;
      }
      for (let i = 1; i <= 2; i += 1) {
        iter[i] = 0;
      }
      qpgen2(Dmat, dvec, n, n, sol, lagr, crval, Amat, bvec, n, q, meq, iact, nact, iter, work, factorized);
      if (factorized[1] === 1) {
        message = "constraints are inconsistent, no solution!";
      }
      if (factorized[1] === 2) {
        message = "matrix D in quadratic function is not positive definite!";
      }
      return {
        solution: sol,
        Lagrangian: lagr,
        value: crval,
        unconstrained_solution: dvec,
        iterations: iter,
        iact,
        message
      };
    }
    exports.solveQP = solveQP2;
  }
});

// node_modules/quadprog/index.js
var require_quadprog2 = __commonJS({
  "node_modules/quadprog/index.js"(exports, module) {
    "use strict";
    module.exports = require_quadprog();
  }
});

// node_modules/javascript-lp-solver/src/Tableau/Solution.js
var require_Solution = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/Solution.js"(exports, module) {
    function Solution(tableau, evaluation, feasible, bounded) {
      this.feasible = feasible;
      this.evaluation = evaluation;
      this.bounded = bounded;
      this._tableau = tableau;
    }
    module.exports = Solution;
    Solution.prototype.generateSolutionSet = function() {
      var solutionSet = {};
      var tableau = this._tableau;
      var varIndexByRow = tableau.varIndexByRow;
      var variablesPerIndex = tableau.variablesPerIndex;
      var matrix = tableau.matrix;
      var rhsColumn = tableau.rhsColumn;
      var lastRow = tableau.height - 1;
      var roundingCoeff = Math.round(1 / tableau.precision);
      for (var r = 1; r <= lastRow; r += 1) {
        var varIndex = varIndexByRow[r];
        var variable = variablesPerIndex[varIndex];
        if (variable === void 0 || variable.isSlack === true) {
          continue;
        }
        var varValue = matrix[r][rhsColumn];
        solutionSet[variable.id] = Math.round((Number.EPSILON + varValue) * roundingCoeff) / roundingCoeff;
      }
      return solutionSet;
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/MilpSolution.js
var require_MilpSolution = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/MilpSolution.js"(exports, module) {
    var Solution = require_Solution();
    function MilpSolution(tableau, evaluation, feasible, bounded, branchAndCutIterations) {
      Solution.call(this, tableau, evaluation, feasible, bounded);
      this.iter = branchAndCutIterations;
    }
    module.exports = MilpSolution;
    MilpSolution.prototype = Object.create(Solution.prototype);
    MilpSolution.constructor = MilpSolution;
  }
});

// node_modules/javascript-lp-solver/src/Tableau/Tableau.js
var require_Tableau = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/Tableau.js"(exports, module) {
    var Solution = require_Solution();
    var MilpSolution = require_MilpSolution();
    function Tableau(precision) {
      this.model = null;
      this.matrix = null;
      this.width = 0;
      this.height = 0;
      this.costRowIndex = 0;
      this.rhsColumn = 0;
      this.variablesPerIndex = [];
      this.unrestrictedVars = null;
      this.feasible = true;
      this.evaluation = 0;
      this.simplexIters = 0;
      this.varIndexByRow = null;
      this.varIndexByCol = null;
      this.rowByVarIndex = null;
      this.colByVarIndex = null;
      this.precision = precision || 1e-8;
      this.optionalObjectives = [];
      this.objectivesByPriority = {};
      this.savedState = null;
      this.availableIndexes = [];
      this.lastElementIndex = 0;
      this.variables = null;
      this.nVars = 0;
      this.bounded = true;
      this.unboundedVarIndex = null;
      this.branchAndCutIterations = 0;
    }
    module.exports = Tableau;
    Tableau.prototype.solve = function() {
      if (this.model.getNumberOfIntegerVariables() > 0) {
        this.branchAndCut();
      } else {
        this.simplex();
      }
      this.updateVariableValues();
      return this.getSolution();
    };
    function OptionalObjective(priority, nColumns) {
      this.priority = priority;
      this.reducedCosts = new Array(nColumns);
      for (var c = 0; c < nColumns; c += 1) {
        this.reducedCosts[c] = 0;
      }
    }
    OptionalObjective.prototype.copy = function() {
      var copy = new OptionalObjective(this.priority, this.reducedCosts.length);
      copy.reducedCosts = this.reducedCosts.slice();
      return copy;
    };
    Tableau.prototype.setOptionalObjective = function(priority, column, cost) {
      var objectiveForPriority = this.objectivesByPriority[priority];
      if (objectiveForPriority === void 0) {
        var nColumns = Math.max(this.width, column + 1);
        objectiveForPriority = new OptionalObjective(priority, nColumns);
        this.objectivesByPriority[priority] = objectiveForPriority;
        this.optionalObjectives.push(objectiveForPriority);
        this.optionalObjectives.sort(function(a, b) {
          return a.priority - b.priority;
        });
      }
      objectiveForPriority.reducedCosts[column] = cost;
    };
    Tableau.prototype.initialize = function(width, height, variables, unrestrictedVars) {
      this.variables = variables;
      this.unrestrictedVars = unrestrictedVars;
      this.width = width;
      this.height = height;
      var tmpRow = new Array(width);
      for (var i = 0; i < width; i++) {
        tmpRow[i] = 0;
      }
      this.matrix = new Array(height);
      for (var j = 0; j < height; j++) {
        this.matrix[j] = tmpRow.slice();
      }
      this.varIndexByRow = new Array(this.height);
      this.varIndexByCol = new Array(this.width);
      this.varIndexByRow[0] = -1;
      this.varIndexByCol[0] = -1;
      this.nVars = width + height - 2;
      this.rowByVarIndex = new Array(this.nVars);
      this.colByVarIndex = new Array(this.nVars);
      this.lastElementIndex = this.nVars;
    };
    Tableau.prototype._resetMatrix = function() {
      var variables = this.model.variables;
      var constraints = this.model.constraints;
      var nVars = variables.length;
      var nConstraints = constraints.length;
      var v, varIndex;
      var costRow = this.matrix[0];
      var coeff = this.model.isMinimization === true ? -1 : 1;
      for (v = 0; v < nVars; v += 1) {
        var variable = variables[v];
        var priority = variable.priority;
        var cost = coeff * variable.cost;
        if (priority === 0) {
          costRow[v + 1] = cost;
        } else {
          this.setOptionalObjective(priority, v + 1, cost);
        }
        varIndex = variables[v].index;
        this.rowByVarIndex[varIndex] = -1;
        this.colByVarIndex[varIndex] = v + 1;
        this.varIndexByCol[v + 1] = varIndex;
      }
      var rowIndex = 1;
      for (var c = 0; c < nConstraints; c += 1) {
        var constraint = constraints[c];
        var constraintIndex = constraint.index;
        this.rowByVarIndex[constraintIndex] = rowIndex;
        this.colByVarIndex[constraintIndex] = -1;
        this.varIndexByRow[rowIndex] = constraintIndex;
        var t, term, column;
        var terms = constraint.terms;
        var nTerms = terms.length;
        var row = this.matrix[rowIndex++];
        if (constraint.isUpperBound) {
          for (t = 0; t < nTerms; t += 1) {
            term = terms[t];
            column = this.colByVarIndex[term.variable.index];
            row[column] = term.coefficient;
          }
          row[0] = constraint.rhs;
        } else {
          for (t = 0; t < nTerms; t += 1) {
            term = terms[t];
            column = this.colByVarIndex[term.variable.index];
            row[column] = -term.coefficient;
          }
          row[0] = -constraint.rhs;
        }
      }
    };
    Tableau.prototype.setModel = function(model) {
      this.model = model;
      var width = model.nVariables + 1;
      var height = model.nConstraints + 1;
      this.initialize(width, height, model.variables, model.unrestrictedVariables);
      this._resetMatrix();
      return this;
    };
    Tableau.prototype.getNewElementIndex = function() {
      if (this.availableIndexes.length > 0) {
        return this.availableIndexes.pop();
      }
      var index = this.lastElementIndex;
      this.lastElementIndex += 1;
      return index;
    };
    Tableau.prototype.density = function() {
      var density = 0;
      var matrix = this.matrix;
      for (var r = 0; r < this.height; r++) {
        var row = matrix[r];
        for (var c = 0; c < this.width; c++) {
          if (row[c] !== 0) {
            density += 1;
          }
        }
      }
      return density / (this.height * this.width);
    };
    Tableau.prototype.setEvaluation = function() {
      var roundingCoeff = Math.round(1 / this.precision);
      var evaluation = this.matrix[this.costRowIndex][this.rhsColumn];
      var roundedEvaluation = Math.round((Number.EPSILON + evaluation) * roundingCoeff) / roundingCoeff;
      this.evaluation = roundedEvaluation;
      if (this.simplexIters === 0) {
        this.bestPossibleEval = roundedEvaluation;
      }
    };
    Tableau.prototype.getSolution = function() {
      var evaluation = this.model.isMinimization === true ? this.evaluation : -this.evaluation;
      if (this.model.getNumberOfIntegerVariables() > 0) {
        return new MilpSolution(this, evaluation, this.feasible, this.bounded, this.branchAndCutIterations);
      } else {
        return new Solution(this, evaluation, this.feasible, this.bounded);
      }
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/simplex.js
var require_simplex = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/simplex.js"() {
    var Tableau = require_Tableau();
    Tableau.prototype.simplex = function() {
      this.bounded = true;
      this.phase1();
      if (this.feasible === true) {
        this.phase2();
      }
      return this;
    };
    Tableau.prototype.phase1 = function() {
      var debugCheckForCycles = this.model.checkForCycles;
      var varIndexesCycle = [];
      var matrix = this.matrix;
      var rhsColumn = this.rhsColumn;
      var lastColumn = this.width - 1;
      var lastRow = this.height - 1;
      var unrestricted;
      var iterations = 0;
      while (true) {
        var leavingRowIndex = 0;
        var rhsValue = -this.precision;
        for (var r = 1; r <= lastRow; r++) {
          unrestricted = this.unrestrictedVars[this.varIndexByRow[r]] === true;
          var value = matrix[r][rhsColumn];
          if (value < rhsValue) {
            rhsValue = value;
            leavingRowIndex = r;
          }
        }
        if (leavingRowIndex === 0) {
          this.feasible = true;
          return iterations;
        }
        var enteringColumn = 0;
        var maxQuotient = -Infinity;
        var costRow = matrix[0];
        var leavingRow = matrix[leavingRowIndex];
        for (var c = 1; c <= lastColumn; c++) {
          var coefficient = leavingRow[c];
          unrestricted = this.unrestrictedVars[this.varIndexByCol[c]] === true;
          if (unrestricted || coefficient < -this.precision) {
            var quotient = -costRow[c] / coefficient;
            if (maxQuotient < quotient) {
              maxQuotient = quotient;
              enteringColumn = c;
            }
          }
        }
        if (enteringColumn === 0) {
          this.feasible = false;
          return iterations;
        }
        if (debugCheckForCycles) {
          varIndexesCycle.push([this.varIndexByRow[leavingRowIndex], this.varIndexByCol[enteringColumn]]);
          var cycleData = this.checkForCycles(varIndexesCycle);
          if (cycleData.length > 0) {
            this.model.messages.push("Cycle in phase 1");
            this.model.messages.push("Start :" + cycleData[0]);
            this.model.messages.push("Length :" + cycleData[1]);
            this.feasible = false;
            return iterations;
          }
        }
        this.pivot(leavingRowIndex, enteringColumn);
        iterations += 1;
      }
    };
    Tableau.prototype.phase2 = function() {
      var debugCheckForCycles = this.model.checkForCycles;
      var varIndexesCycle = [];
      var matrix = this.matrix;
      var rhsColumn = this.rhsColumn;
      var lastColumn = this.width - 1;
      var lastRow = this.height - 1;
      var precision = this.precision;
      var nOptionalObjectives = this.optionalObjectives.length;
      var optionalCostsColumns = null;
      var iterations = 0;
      var reducedCost, unrestricted;
      while (true) {
        var costRow = matrix[this.costRowIndex];
        if (nOptionalObjectives > 0) {
          optionalCostsColumns = [];
        }
        var enteringColumn = 0;
        var enteringValue = precision;
        var isReducedCostNegative = false;
        for (var c = 1; c <= lastColumn; c++) {
          reducedCost = costRow[c];
          unrestricted = this.unrestrictedVars[this.varIndexByCol[c]] === true;
          if (nOptionalObjectives > 0 && -precision < reducedCost && reducedCost < precision) {
            optionalCostsColumns.push(c);
            continue;
          }
          if (unrestricted && reducedCost < 0) {
            if (-reducedCost > enteringValue) {
              enteringValue = -reducedCost;
              enteringColumn = c;
              isReducedCostNegative = true;
            }
            continue;
          }
          if (reducedCost > enteringValue) {
            enteringValue = reducedCost;
            enteringColumn = c;
            isReducedCostNegative = false;
          }
        }
        if (nOptionalObjectives > 0) {
          var o = 0;
          while (enteringColumn === 0 && optionalCostsColumns.length > 0 && o < nOptionalObjectives) {
            var optionalCostsColumns2 = [];
            var reducedCosts = this.optionalObjectives[o].reducedCosts;
            enteringValue = precision;
            for (var i = 0; i < optionalCostsColumns.length; i++) {
              c = optionalCostsColumns[i];
              reducedCost = reducedCosts[c];
              unrestricted = this.unrestrictedVars[this.varIndexByCol[c]] === true;
              if (-precision < reducedCost && reducedCost < precision) {
                optionalCostsColumns2.push(c);
                continue;
              }
              if (unrestricted && reducedCost < 0) {
                if (-reducedCost > enteringValue) {
                  enteringValue = -reducedCost;
                  enteringColumn = c;
                  isReducedCostNegative = true;
                }
                continue;
              }
              if (reducedCost > enteringValue) {
                enteringValue = reducedCost;
                enteringColumn = c;
                isReducedCostNegative = false;
              }
            }
            optionalCostsColumns = optionalCostsColumns2;
            o += 1;
          }
        }
        if (enteringColumn === 0) {
          this.setEvaluation();
          this.simplexIters += 1;
          return iterations;
        }
        var leavingRow = 0;
        var minQuotient = Infinity;
        var varIndexByRow = this.varIndexByRow;
        for (var r = 1; r <= lastRow; r++) {
          var row = matrix[r];
          var rhsValue = row[rhsColumn];
          var colValue = row[enteringColumn];
          if (-precision < colValue && colValue < precision) {
            continue;
          }
          if (colValue > 0 && precision > rhsValue && rhsValue > -precision) {
            minQuotient = 0;
            leavingRow = r;
            break;
          }
          var quotient = isReducedCostNegative ? -rhsValue / colValue : rhsValue / colValue;
          if (quotient > precision && minQuotient > quotient) {
            minQuotient = quotient;
            leavingRow = r;
          }
        }
        if (minQuotient === Infinity) {
          this.evaluation = -Infinity;
          this.bounded = false;
          this.unboundedVarIndex = this.varIndexByCol[enteringColumn];
          return iterations;
        }
        if (debugCheckForCycles) {
          varIndexesCycle.push([this.varIndexByRow[leavingRow], this.varIndexByCol[enteringColumn]]);
          var cycleData = this.checkForCycles(varIndexesCycle);
          if (cycleData.length > 0) {
            this.model.messages.push("Cycle in phase 2");
            this.model.messages.push("Start :" + cycleData[0]);
            this.model.messages.push("Length :" + cycleData[1]);
            this.feasible = false;
            return iterations;
          }
        }
        this.pivot(leavingRow, enteringColumn, true);
        iterations += 1;
      }
    };
    var nonZeroColumns = [];
    Tableau.prototype.pivot = function(pivotRowIndex, pivotColumnIndex) {
      var matrix = this.matrix;
      var quotient = matrix[pivotRowIndex][pivotColumnIndex];
      var lastRow = this.height - 1;
      var lastColumn = this.width - 1;
      var leavingBasicIndex = this.varIndexByRow[pivotRowIndex];
      var enteringBasicIndex = this.varIndexByCol[pivotColumnIndex];
      this.varIndexByRow[pivotRowIndex] = enteringBasicIndex;
      this.varIndexByCol[pivotColumnIndex] = leavingBasicIndex;
      this.rowByVarIndex[enteringBasicIndex] = pivotRowIndex;
      this.rowByVarIndex[leavingBasicIndex] = -1;
      this.colByVarIndex[enteringBasicIndex] = -1;
      this.colByVarIndex[leavingBasicIndex] = pivotColumnIndex;
      var pivotRow = matrix[pivotRowIndex];
      var nNonZeroColumns = 0;
      for (var c = 0; c <= lastColumn; c++) {
        if (!(pivotRow[c] >= -1e-16 && pivotRow[c] <= 1e-16)) {
          pivotRow[c] /= quotient;
          nonZeroColumns[nNonZeroColumns] = c;
          nNonZeroColumns += 1;
        } else {
          pivotRow[c] = 0;
        }
      }
      pivotRow[pivotColumnIndex] = 1 / quotient;
      var coefficient, i, v0;
      var precision = this.precision;
      for (var r = 0; r <= lastRow; r++) {
        if (r !== pivotRowIndex) {
          if (!(matrix[r][pivotColumnIndex] >= -1e-16 && matrix[r][pivotColumnIndex] <= 1e-16)) {
            var row = matrix[r];
            coefficient = row[pivotColumnIndex];
            if (!(coefficient >= -1e-16 && coefficient <= 1e-16)) {
              for (i = 0; i < nNonZeroColumns; i++) {
                c = nonZeroColumns[i];
                v0 = pivotRow[c];
                if (!(v0 >= -1e-16 && v0 <= 1e-16)) {
                  row[c] = row[c] - coefficient * v0;
                } else {
                  if (v0 !== 0) {
                    pivotRow[c] = 0;
                  }
                }
              }
              row[pivotColumnIndex] = -coefficient / quotient;
            } else {
              if (coefficient !== 0) {
                row[pivotColumnIndex] = 0;
              }
            }
          }
        }
      }
      var nOptionalObjectives = this.optionalObjectives.length;
      if (nOptionalObjectives > 0) {
        for (var o = 0; o < nOptionalObjectives; o += 1) {
          var reducedCosts = this.optionalObjectives[o].reducedCosts;
          coefficient = reducedCosts[pivotColumnIndex];
          if (coefficient !== 0) {
            for (i = 0; i < nNonZeroColumns; i++) {
              c = nonZeroColumns[i];
              v0 = pivotRow[c];
              if (v0 !== 0) {
                reducedCosts[c] = reducedCosts[c] - coefficient * v0;
              }
            }
            reducedCosts[pivotColumnIndex] = -coefficient / quotient;
          }
        }
      }
    };
    Tableau.prototype.checkForCycles = function(varIndexes) {
      for (var e1 = 0; e1 < varIndexes.length - 1; e1++) {
        for (var e2 = e1 + 1; e2 < varIndexes.length; e2++) {
          var elt1 = varIndexes[e1];
          var elt2 = varIndexes[e2];
          if (elt1[0] === elt2[0] && elt1[1] === elt2[1]) {
            if (e2 - e1 > varIndexes.length - e2) {
              break;
            }
            var cycleFound = true;
            for (var i = 1; i < e2 - e1; i++) {
              var tmp1 = varIndexes[e1 + i];
              var tmp2 = varIndexes[e2 + i];
              if (tmp1[0] !== tmp2[0] || tmp1[1] !== tmp2[1]) {
                cycleFound = false;
                break;
              }
            }
            if (cycleFound) {
              return [e1, e2 - e1];
            }
          }
        }
      }
      return [];
    };
  }
});

// node_modules/javascript-lp-solver/src/expressions.js
var require_expressions = __commonJS({
  "node_modules/javascript-lp-solver/src/expressions.js"(exports, module) {
    function Variable(id, cost, index, priority) {
      this.id = id;
      this.cost = cost;
      this.index = index;
      this.value = 0;
      this.priority = priority;
    }
    function IntegerVariable(id, cost, index, priority) {
      Variable.call(this, id, cost, index, priority);
    }
    IntegerVariable.prototype.isInteger = true;
    function SlackVariable(id, index) {
      Variable.call(this, id, 0, index, 0);
    }
    SlackVariable.prototype.isSlack = true;
    function Term(variable, coefficient) {
      this.variable = variable;
      this.coefficient = coefficient;
    }
    function createRelaxationVariable(model, weight, priority) {
      if (priority === 0 || priority === "required") {
        return null;
      }
      weight = weight || 1;
      priority = priority || 1;
      if (model.isMinimization === false) {
        weight = -weight;
      }
      return model.addVariable(weight, "r" + model.relaxationIndex++, false, false, priority);
    }
    function Constraint(rhs, isUpperBound, index, model) {
      this.slack = new SlackVariable("s" + index, index);
      this.index = index;
      this.model = model;
      this.rhs = rhs;
      this.isUpperBound = isUpperBound;
      this.terms = [];
      this.termsByVarIndex = {};
      this.relaxation = null;
    }
    Constraint.prototype.addTerm = function(coefficient, variable) {
      var varIndex = variable.index;
      var term = this.termsByVarIndex[varIndex];
      if (term === void 0) {
        term = new Term(variable, coefficient);
        this.termsByVarIndex[varIndex] = term;
        this.terms.push(term);
        if (this.isUpperBound === true) {
          coefficient = -coefficient;
        }
        this.model.updateConstraintCoefficient(this, variable, coefficient);
      } else {
        var newCoefficient = term.coefficient + coefficient;
        this.setVariableCoefficient(newCoefficient, variable);
      }
      return this;
    };
    Constraint.prototype.removeTerm = function(term) {
      return this;
    };
    Constraint.prototype.setRightHandSide = function(newRhs) {
      if (newRhs !== this.rhs) {
        var difference = newRhs - this.rhs;
        if (this.isUpperBound === true) {
          difference = -difference;
        }
        this.rhs = newRhs;
        this.model.updateRightHandSide(this, difference);
      }
      return this;
    };
    Constraint.prototype.setVariableCoefficient = function(newCoefficient, variable) {
      var varIndex = variable.index;
      if (varIndex === -1) {
        console.warn("[Constraint.setVariableCoefficient] Trying to change coefficient of inexistant variable.");
        return;
      }
      var term = this.termsByVarIndex[varIndex];
      if (term === void 0) {
        this.addTerm(newCoefficient, variable);
      } else {
        if (newCoefficient !== term.coefficient) {
          var difference = newCoefficient - term.coefficient;
          if (this.isUpperBound === true) {
            difference = -difference;
          }
          term.coefficient = newCoefficient;
          this.model.updateConstraintCoefficient(this, variable, difference);
        }
      }
      return this;
    };
    Constraint.prototype.relax = function(weight, priority) {
      this.relaxation = createRelaxationVariable(this.model, weight, priority);
      this._relax(this.relaxation);
    };
    Constraint.prototype._relax = function(relaxationVariable) {
      if (relaxationVariable === null) {
        return;
      }
      if (this.isUpperBound) {
        this.setVariableCoefficient(-1, relaxationVariable);
      } else {
        this.setVariableCoefficient(1, relaxationVariable);
      }
    };
    function Equality(constraintUpper, constraintLower) {
      this.upperBound = constraintUpper;
      this.lowerBound = constraintLower;
      this.model = constraintUpper.model;
      this.rhs = constraintUpper.rhs;
      this.relaxation = null;
    }
    Equality.prototype.isEquality = true;
    Equality.prototype.addTerm = function(coefficient, variable) {
      this.upperBound.addTerm(coefficient, variable);
      this.lowerBound.addTerm(coefficient, variable);
      return this;
    };
    Equality.prototype.removeTerm = function(term) {
      this.upperBound.removeTerm(term);
      this.lowerBound.removeTerm(term);
      return this;
    };
    Equality.prototype.setRightHandSide = function(rhs) {
      this.upperBound.setRightHandSide(rhs);
      this.lowerBound.setRightHandSide(rhs);
      this.rhs = rhs;
    };
    Equality.prototype.relax = function(weight, priority) {
      this.relaxation = createRelaxationVariable(this.model, weight, priority);
      this.upperBound.relaxation = this.relaxation;
      this.upperBound._relax(this.relaxation);
      this.lowerBound.relaxation = this.relaxation;
      this.lowerBound._relax(this.relaxation);
    };
    module.exports = {
      Constraint,
      Variable,
      IntegerVariable,
      SlackVariable,
      Equality,
      Term
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/cuttingStrategies.js
var require_cuttingStrategies = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/cuttingStrategies.js"() {
    var Tableau = require_Tableau();
    var SlackVariable = require_expressions().SlackVariable;
    Tableau.prototype.addCutConstraints = function(cutConstraints) {
      var nCutConstraints = cutConstraints.length;
      var height = this.height;
      var heightWithCuts = height + nCutConstraints;
      for (var h = height; h < heightWithCuts; h += 1) {
        if (this.matrix[h] === void 0) {
          this.matrix[h] = this.matrix[h - 1].slice();
        }
      }
      this.height = heightWithCuts;
      this.nVars = this.width + this.height - 2;
      var c;
      var lastColumn = this.width - 1;
      for (var i = 0; i < nCutConstraints; i += 1) {
        var cut = cutConstraints[i];
        var r = height + i;
        var sign = cut.type === "min" ? -1 : 1;
        var varIndex = cut.varIndex;
        var varRowIndex = this.rowByVarIndex[varIndex];
        var constraintRow = this.matrix[r];
        if (varRowIndex === -1) {
          constraintRow[this.rhsColumn] = sign * cut.value;
          for (c = 1; c <= lastColumn; c += 1) {
            constraintRow[c] = 0;
          }
          constraintRow[this.colByVarIndex[varIndex]] = sign;
        } else {
          var varRow = this.matrix[varRowIndex];
          var varValue = varRow[this.rhsColumn];
          constraintRow[this.rhsColumn] = sign * (cut.value - varValue);
          for (c = 1; c <= lastColumn; c += 1) {
            constraintRow[c] = -sign * varRow[c];
          }
        }
        var slackVarIndex = this.getNewElementIndex();
        this.varIndexByRow[r] = slackVarIndex;
        this.rowByVarIndex[slackVarIndex] = r;
        this.colByVarIndex[slackVarIndex] = -1;
        this.variablesPerIndex[slackVarIndex] = new SlackVariable("s" + slackVarIndex, slackVarIndex);
        this.nVars += 1;
      }
    };
    Tableau.prototype._addLowerBoundMIRCut = function(rowIndex) {
      if (rowIndex === this.costRowIndex) {
        return false;
      }
      var model = this.model;
      var matrix = this.matrix;
      var intVar = this.variablesPerIndex[this.varIndexByRow[rowIndex]];
      if (!intVar.isInteger) {
        return false;
      }
      var d = matrix[rowIndex][this.rhsColumn];
      var frac_d = d - Math.floor(d);
      if (frac_d < this.precision || 1 - this.precision < frac_d) {
        return false;
      }
      var r = this.height;
      matrix[r] = matrix[r - 1].slice();
      this.height += 1;
      this.nVars += 1;
      var slackVarIndex = this.getNewElementIndex();
      this.varIndexByRow[r] = slackVarIndex;
      this.rowByVarIndex[slackVarIndex] = r;
      this.colByVarIndex[slackVarIndex] = -1;
      this.variablesPerIndex[slackVarIndex] = new SlackVariable("s" + slackVarIndex, slackVarIndex);
      matrix[r][this.rhsColumn] = Math.floor(d);
      for (var colIndex = 1; colIndex < this.varIndexByCol.length; colIndex += 1) {
        var variable = this.variablesPerIndex[this.varIndexByCol[colIndex]];
        if (!variable.isInteger) {
          matrix[r][colIndex] = Math.min(0, matrix[rowIndex][colIndex] / (1 - frac_d));
        } else {
          var coef = matrix[rowIndex][colIndex];
          var termCoeff = Math.floor(coef) + Math.max(0, coef - Math.floor(coef) - frac_d) / (1 - frac_d);
          matrix[r][colIndex] = termCoeff;
        }
      }
      for (var c = 0; c < this.width; c += 1) {
        matrix[r][c] -= matrix[rowIndex][c];
      }
      return true;
    };
    Tableau.prototype._addUpperBoundMIRCut = function(rowIndex) {
      if (rowIndex === this.costRowIndex) {
        return false;
      }
      var model = this.model;
      var matrix = this.matrix;
      var intVar = this.variablesPerIndex[this.varIndexByRow[rowIndex]];
      if (!intVar.isInteger) {
        return false;
      }
      var b = matrix[rowIndex][this.rhsColumn];
      var f = b - Math.floor(b);
      if (f < this.precision || 1 - this.precision < f) {
        return false;
      }
      var r = this.height;
      matrix[r] = matrix[r - 1].slice();
      this.height += 1;
      this.nVars += 1;
      var slackVarIndex = this.getNewElementIndex();
      this.varIndexByRow[r] = slackVarIndex;
      this.rowByVarIndex[slackVarIndex] = r;
      this.colByVarIndex[slackVarIndex] = -1;
      this.variablesPerIndex[slackVarIndex] = new SlackVariable("s" + slackVarIndex, slackVarIndex);
      matrix[r][this.rhsColumn] = -f;
      for (var colIndex = 1; colIndex < this.varIndexByCol.length; colIndex += 1) {
        var variable = this.variablesPerIndex[this.varIndexByCol[colIndex]];
        var aj = matrix[rowIndex][colIndex];
        var fj = aj - Math.floor(aj);
        if (variable.isInteger) {
          if (fj <= f) {
            matrix[r][colIndex] = -fj;
          } else {
            matrix[r][colIndex] = -(1 - fj) * f / fj;
          }
        } else {
          if (aj >= 0) {
            matrix[r][colIndex] = -aj;
          } else {
            matrix[r][colIndex] = aj * f / (1 - f);
          }
        }
      }
      return true;
    };
    Tableau.prototype.applyMIRCuts = function() {
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/dynamicModification.js
var require_dynamicModification = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/dynamicModification.js"() {
    var Tableau = require_Tableau();
    Tableau.prototype._putInBase = function(varIndex) {
      var r = this.rowByVarIndex[varIndex];
      if (r === -1) {
        var c = this.colByVarIndex[varIndex];
        for (var r1 = 1; r1 < this.height; r1 += 1) {
          var coefficient = this.matrix[r1][c];
          if (coefficient < -this.precision || this.precision < coefficient) {
            r = r1;
            break;
          }
        }
        this.pivot(r, c);
      }
      return r;
    };
    Tableau.prototype._takeOutOfBase = function(varIndex) {
      var c = this.colByVarIndex[varIndex];
      if (c === -1) {
        var r = this.rowByVarIndex[varIndex];
        var pivotRow = this.matrix[r];
        for (var c1 = 1; c1 < this.height; c1 += 1) {
          var coefficient = pivotRow[c1];
          if (coefficient < -this.precision || this.precision < coefficient) {
            c = c1;
            break;
          }
        }
        this.pivot(r, c);
      }
      return c;
    };
    Tableau.prototype.updateVariableValues = function() {
      var nVars = this.variables.length;
      var roundingCoeff = Math.round(1 / this.precision);
      for (var v = 0; v < nVars; v += 1) {
        var variable = this.variables[v];
        var varIndex = variable.index;
        var r = this.rowByVarIndex[varIndex];
        if (r === -1) {
          variable.value = 0;
        } else {
          var varValue = this.matrix[r][this.rhsColumn];
          variable.value = Math.round((varValue + Number.EPSILON) * roundingCoeff) / roundingCoeff;
        }
      }
    };
    Tableau.prototype.updateRightHandSide = function(constraint, difference) {
      var lastRow = this.height - 1;
      var constraintRow = this.rowByVarIndex[constraint.index];
      if (constraintRow === -1) {
        var slackColumn = this.colByVarIndex[constraint.index];
        for (var r = 0; r <= lastRow; r += 1) {
          var row = this.matrix[r];
          row[this.rhsColumn] -= difference * row[slackColumn];
        }
        var nOptionalObjectives = this.optionalObjectives.length;
        if (nOptionalObjectives > 0) {
          for (var o = 0; o < nOptionalObjectives; o += 1) {
            var reducedCosts = this.optionalObjectives[o].reducedCosts;
            reducedCosts[this.rhsColumn] -= difference * reducedCosts[slackColumn];
          }
        }
      } else {
        this.matrix[constraintRow][this.rhsColumn] -= difference;
      }
    };
    Tableau.prototype.updateConstraintCoefficient = function(constraint, variable, difference) {
      if (constraint.index === variable.index) {
        throw new Error("[Tableau.updateConstraintCoefficient] constraint index should not be equal to variable index !");
      }
      var r = this._putInBase(constraint.index);
      var colVar = this.colByVarIndex[variable.index];
      if (colVar === -1) {
        var rowVar = this.rowByVarIndex[variable.index];
        for (var c = 0; c < this.width; c += 1) {
          this.matrix[r][c] += difference * this.matrix[rowVar][c];
        }
      } else {
        this.matrix[r][colVar] -= difference;
      }
    };
    Tableau.prototype.updateCost = function(variable, difference) {
      var varIndex = variable.index;
      var lastColumn = this.width - 1;
      var varColumn = this.colByVarIndex[varIndex];
      if (varColumn === -1) {
        var variableRow = this.matrix[this.rowByVarIndex[varIndex]];
        var c;
        if (variable.priority === 0) {
          var costRow = this.matrix[0];
          for (c = 0; c <= lastColumn; c += 1) {
            costRow[c] += difference * variableRow[c];
          }
        } else {
          var reducedCosts = this.objectivesByPriority[variable.priority].reducedCosts;
          for (c = 0; c <= lastColumn; c += 1) {
            reducedCosts[c] += difference * variableRow[c];
          }
        }
      } else {
        this.matrix[0][varColumn] -= difference;
      }
    };
    Tableau.prototype.addConstraint = function(constraint) {
      var sign = constraint.isUpperBound ? 1 : -1;
      var lastRow = this.height;
      var constraintRow = this.matrix[lastRow];
      if (constraintRow === void 0) {
        constraintRow = this.matrix[0].slice();
        this.matrix[lastRow] = constraintRow;
      }
      var lastColumn = this.width - 1;
      for (var c = 0; c <= lastColumn; c += 1) {
        constraintRow[c] = 0;
      }
      constraintRow[this.rhsColumn] = sign * constraint.rhs;
      var terms = constraint.terms;
      var nTerms = terms.length;
      for (var t = 0; t < nTerms; t += 1) {
        var term = terms[t];
        var coefficient = term.coefficient;
        var varIndex = term.variable.index;
        var varRowIndex = this.rowByVarIndex[varIndex];
        if (varRowIndex === -1) {
          constraintRow[this.colByVarIndex[varIndex]] += sign * coefficient;
        } else {
          var varRow = this.matrix[varRowIndex];
          var varValue = varRow[this.rhsColumn];
          for (c = 0; c <= lastColumn; c += 1) {
            constraintRow[c] -= sign * coefficient * varRow[c];
          }
        }
      }
      var slackIndex = constraint.index;
      this.varIndexByRow[lastRow] = slackIndex;
      this.rowByVarIndex[slackIndex] = lastRow;
      this.colByVarIndex[slackIndex] = -1;
      this.height += 1;
    };
    Tableau.prototype.removeConstraint = function(constraint) {
      var slackIndex = constraint.index;
      var lastRow = this.height - 1;
      var r = this._putInBase(slackIndex);
      var tmpRow = this.matrix[lastRow];
      this.matrix[lastRow] = this.matrix[r];
      this.matrix[r] = tmpRow;
      this.varIndexByRow[r] = this.varIndexByRow[lastRow];
      this.varIndexByRow[lastRow] = -1;
      this.rowByVarIndex[slackIndex] = -1;
      this.availableIndexes[this.availableIndexes.length] = slackIndex;
      constraint.slack.index = -1;
      this.height -= 1;
    };
    Tableau.prototype.addVariable = function(variable) {
      var lastRow = this.height - 1;
      var lastColumn = this.width;
      var cost = this.model.isMinimization === true ? -variable.cost : variable.cost;
      var priority = variable.priority;
      var nOptionalObjectives = this.optionalObjectives.length;
      if (nOptionalObjectives > 0) {
        for (var o = 0; o < nOptionalObjectives; o += 1) {
          this.optionalObjectives[o].reducedCosts[lastColumn] = 0;
        }
      }
      if (priority === 0) {
        this.matrix[0][lastColumn] = cost;
      } else {
        this.setOptionalObjective(priority, lastColumn, cost);
        this.matrix[0][lastColumn] = 0;
      }
      for (var r = 1; r <= lastRow; r += 1) {
        this.matrix[r][lastColumn] = 0;
      }
      var varIndex = variable.index;
      this.varIndexByCol[lastColumn] = varIndex;
      this.rowByVarIndex[varIndex] = -1;
      this.colByVarIndex[varIndex] = lastColumn;
      this.width += 1;
    };
    Tableau.prototype.removeVariable = function(variable) {
      var varIndex = variable.index;
      var c = this._takeOutOfBase(varIndex);
      var lastColumn = this.width - 1;
      if (c !== lastColumn) {
        var lastRow = this.height - 1;
        for (var r = 0; r <= lastRow; r += 1) {
          var row = this.matrix[r];
          row[c] = row[lastColumn];
        }
        var nOptionalObjectives = this.optionalObjectives.length;
        if (nOptionalObjectives > 0) {
          for (var o = 0; o < nOptionalObjectives; o += 1) {
            var reducedCosts = this.optionalObjectives[o].reducedCosts;
            reducedCosts[c] = reducedCosts[lastColumn];
          }
        }
        var switchVarIndex = this.varIndexByCol[lastColumn];
        this.varIndexByCol[c] = switchVarIndex;
        this.colByVarIndex[switchVarIndex] = c;
      }
      this.varIndexByCol[lastColumn] = -1;
      this.colByVarIndex[varIndex] = -1;
      this.availableIndexes[this.availableIndexes.length] = varIndex;
      variable.index = -1;
      this.width -= 1;
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/log.js
var require_log = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/log.js"() {
    var Tableau = require_Tableau();
    Tableau.prototype.log = function(message, force) {
      if (false) {
        return;
      }
      console.log("****", message, "****");
      console.log("Nb Variables", this.width - 1);
      console.log("Nb Constraints", this.height - 1);
      console.log("Basic Indexes", this.varIndexByRow);
      console.log("Non Basic Indexes", this.varIndexByCol);
      console.log("Rows", this.rowByVarIndex);
      console.log("Cols", this.colByVarIndex);
      var digitPrecision = 5;
      var varNameRowString = "", spacePerColumn = [" "], j, c, s, r, variable, varIndex, varName, varNameLength, nSpaces, valueSpace, nameSpace;
      var row, rowString;
      for (c = 1; c < this.width; c += 1) {
        varIndex = this.varIndexByCol[c];
        variable = this.variablesPerIndex[varIndex];
        if (variable === void 0) {
          varName = "c" + varIndex;
        } else {
          varName = variable.id;
        }
        varNameLength = varName.length;
        nSpaces = Math.abs(varNameLength - 5);
        valueSpace = " ";
        nameSpace = "	";
        if (varNameLength > 5) {
          valueSpace += " ";
        } else {
          nameSpace += "	";
        }
        spacePerColumn[c] = valueSpace;
        varNameRowString += nameSpace + varName;
      }
      console.log(varNameRowString);
      var signSpace;
      var firstRow = this.matrix[this.costRowIndex];
      var firstRowString = "	";
      for (j = 1; j < this.width; j += 1) {
        signSpace = "	";
        firstRowString += signSpace;
        firstRowString += spacePerColumn[j];
        firstRowString += firstRow[j].toFixed(digitPrecision);
      }
      signSpace = "	";
      firstRowString += signSpace + spacePerColumn[0] + firstRow[0].toFixed(digitPrecision);
      console.log(firstRowString + "	Z");
      for (r = 1; r < this.height; r += 1) {
        row = this.matrix[r];
        rowString = "	";
        for (c = 1; c < this.width; c += 1) {
          signSpace = "	";
          rowString += signSpace + spacePerColumn[c] + row[c].toFixed(digitPrecision);
        }
        signSpace = "	";
        rowString += signSpace + spacePerColumn[0] + row[0].toFixed(digitPrecision);
        varIndex = this.varIndexByRow[r];
        variable = this.variablesPerIndex[varIndex];
        if (variable === void 0) {
          varName = "c" + varIndex;
        } else {
          varName = variable.id;
        }
        console.log(rowString + "	" + varName);
      }
      console.log("");
      var nOptionalObjectives = this.optionalObjectives.length;
      if (nOptionalObjectives > 0) {
        console.log("    Optional objectives:");
        for (var o = 0; o < nOptionalObjectives; o += 1) {
          var reducedCosts = this.optionalObjectives[o].reducedCosts;
          var reducedCostsString = "";
          for (j = 1; j < this.width; j += 1) {
            signSpace = reducedCosts[j] < 0 ? "" : " ";
            reducedCostsString += signSpace;
            reducedCostsString += spacePerColumn[j];
            reducedCostsString += reducedCosts[j].toFixed(digitPrecision);
          }
          signSpace = reducedCosts[0] < 0 ? "" : " ";
          reducedCostsString += signSpace + spacePerColumn[0] + reducedCosts[0].toFixed(digitPrecision);
          console.log(reducedCostsString + " z" + o);
        }
      }
      console.log("Feasible?", this.feasible);
      console.log("evaluation", this.evaluation);
      return this;
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/backup.js
var require_backup = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/backup.js"() {
    var Tableau = require_Tableau();
    Tableau.prototype.copy = function() {
      var copy = new Tableau(this.precision);
      copy.width = this.width;
      copy.height = this.height;
      copy.nVars = this.nVars;
      copy.model = this.model;
      copy.variables = this.variables;
      copy.variablesPerIndex = this.variablesPerIndex;
      copy.unrestrictedVars = this.unrestrictedVars;
      copy.lastElementIndex = this.lastElementIndex;
      copy.varIndexByRow = this.varIndexByRow.slice();
      copy.varIndexByCol = this.varIndexByCol.slice();
      copy.rowByVarIndex = this.rowByVarIndex.slice();
      copy.colByVarIndex = this.colByVarIndex.slice();
      copy.availableIndexes = this.availableIndexes.slice();
      var optionalObjectivesCopy = [];
      for (var o = 0; o < this.optionalObjectives.length; o++) {
        optionalObjectivesCopy[o] = this.optionalObjectives[o].copy();
      }
      copy.optionalObjectives = optionalObjectivesCopy;
      var matrix = this.matrix;
      var matrixCopy = new Array(this.height);
      for (var r = 0; r < this.height; r++) {
        matrixCopy[r] = matrix[r].slice();
      }
      copy.matrix = matrixCopy;
      return copy;
    };
    Tableau.prototype.save = function() {
      this.savedState = this.copy();
    };
    Tableau.prototype.restore = function() {
      if (this.savedState === null) {
        return;
      }
      var save = this.savedState;
      var savedMatrix = save.matrix;
      this.nVars = save.nVars;
      this.model = save.model;
      this.variables = save.variables;
      this.variablesPerIndex = save.variablesPerIndex;
      this.unrestrictedVars = save.unrestrictedVars;
      this.lastElementIndex = save.lastElementIndex;
      this.width = save.width;
      this.height = save.height;
      var r, c;
      for (r = 0; r < this.height; r += 1) {
        var savedRow = savedMatrix[r];
        var row = this.matrix[r];
        for (c = 0; c < this.width; c += 1) {
          row[c] = savedRow[c];
        }
      }
      var savedBasicIndexes = save.varIndexByRow;
      for (c = 0; c < this.height; c += 1) {
        this.varIndexByRow[c] = savedBasicIndexes[c];
      }
      while (this.varIndexByRow.length > this.height) {
        this.varIndexByRow.pop();
      }
      var savedNonBasicIndexes = save.varIndexByCol;
      for (r = 0; r < this.width; r += 1) {
        this.varIndexByCol[r] = savedNonBasicIndexes[r];
      }
      while (this.varIndexByCol.length > this.width) {
        this.varIndexByCol.pop();
      }
      var savedRows = save.rowByVarIndex;
      var savedCols = save.colByVarIndex;
      for (var v = 0; v < this.nVars; v += 1) {
        this.rowByVarIndex[v] = savedRows[v];
        this.colByVarIndex[v] = savedCols[v];
      }
      if (save.optionalObjectives.length > 0 && this.optionalObjectives.length > 0) {
        this.optionalObjectives = [];
        this.optionalObjectivePerPriority = {};
        for (var o = 0; o < save.optionalObjectives.length; o++) {
          var optionalObjectiveCopy = save.optionalObjectives[o].copy();
          this.optionalObjectives[o] = optionalObjectiveCopy;
          this.optionalObjectivePerPriority[optionalObjectiveCopy.priority] = optionalObjectiveCopy;
        }
      }
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/branchingStrategies.js
var require_branchingStrategies = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/branchingStrategies.js"() {
    var Tableau = require_Tableau();
    function VariableData(index, value) {
      this.index = index;
      this.value = value;
    }
    Tableau.prototype.getMostFractionalVar = function() {
      var biggestFraction = 0;
      var selectedVarIndex = null;
      var selectedVarValue = null;
      var mid = 0.5;
      var integerVariables = this.model.integerVariables;
      var nIntegerVars = integerVariables.length;
      for (var v = 0; v < nIntegerVars; v++) {
        var varIndex = integerVariables[v].index;
        var varRow = this.rowByVarIndex[varIndex];
        if (varRow === -1) {
          continue;
        }
        var varValue = this.matrix[varRow][this.rhsColumn];
        var fraction = Math.abs(varValue - Math.round(varValue));
        if (biggestFraction < fraction) {
          biggestFraction = fraction;
          selectedVarIndex = varIndex;
          selectedVarValue = varValue;
        }
      }
      return new VariableData(selectedVarIndex, selectedVarValue);
    };
    Tableau.prototype.getFractionalVarWithLowestCost = function() {
      var highestCost = Infinity;
      var selectedVarIndex = null;
      var selectedVarValue = null;
      var integerVariables = this.model.integerVariables;
      var nIntegerVars = integerVariables.length;
      for (var v = 0; v < nIntegerVars; v++) {
        var variable = integerVariables[v];
        var varIndex = variable.index;
        var varRow = this.rowByVarIndex[varIndex];
        if (varRow === -1) {
          continue;
        }
        var varValue = this.matrix[varRow][this.rhsColumn];
        if (Math.abs(varValue - Math.round(varValue)) > this.precision) {
          var cost = variable.cost;
          if (highestCost > cost) {
            highestCost = cost;
            selectedVarIndex = varIndex;
            selectedVarValue = varValue;
          }
        }
      }
      return new VariableData(selectedVarIndex, selectedVarValue);
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/integerProperties.js
var require_integerProperties = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/integerProperties.js"() {
    var Tableau = require_Tableau();
    Tableau.prototype.countIntegerValues = function() {
      var count = 0;
      for (var r = 1; r < this.height; r += 1) {
        if (this.variablesPerIndex[this.varIndexByRow[r]].isInteger) {
          var decimalPart = this.matrix[r][this.rhsColumn];
          decimalPart = decimalPart - Math.floor(decimalPart);
          if (decimalPart < this.precision && -decimalPart < this.precision) {
            count += 1;
          }
        }
      }
      return count;
    };
    Tableau.prototype.isIntegral = function() {
      var integerVariables = this.model.integerVariables;
      var nIntegerVars = integerVariables.length;
      for (var v = 0; v < nIntegerVars; v++) {
        var varRow = this.rowByVarIndex[integerVariables[v].index];
        if (varRow === -1) {
          continue;
        }
        var varValue = this.matrix[varRow][this.rhsColumn];
        if (Math.abs(varValue - Math.round(varValue)) > this.precision) {
          return false;
        }
      }
      return true;
    };
    Tableau.prototype.computeFractionalVolume = function(ignoreIntegerValues) {
      var volume = -1;
      for (var r = 1; r < this.height; r += 1) {
        if (this.variablesPerIndex[this.varIndexByRow[r]].isInteger) {
          var rhs = this.matrix[r][this.rhsColumn];
          rhs = Math.abs(rhs);
          var decimalPart = Math.min(rhs - Math.floor(rhs), Math.floor(rhs + 1));
          if (decimalPart < this.precision) {
            if (!ignoreIntegerValues) {
              return 0;
            }
          } else {
            if (volume === -1) {
              volume = rhs;
            } else {
              volume *= rhs;
            }
          }
        }
      }
      if (volume === -1) {
        return 0;
      }
      return volume;
    };
  }
});

// node_modules/javascript-lp-solver/src/Tableau/index.js
var require_Tableau2 = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/index.js"(exports, module) {
    require_simplex();
    require_cuttingStrategies();
    require_dynamicModification();
    require_log();
    require_backup();
    require_branchingStrategies();
    require_integerProperties();
    module.exports = require_Tableau();
  }
});

// node_modules/javascript-lp-solver/src/Tableau/branchAndCut.js
var require_branchAndCut = __commonJS({
  "node_modules/javascript-lp-solver/src/Tableau/branchAndCut.js"() {
    var Tableau = require_Tableau();
    function Cut(type, varIndex, value) {
      this.type = type;
      this.varIndex = varIndex;
      this.value = value;
    }
    function Branch(relaxedEvaluation, cuts) {
      this.relaxedEvaluation = relaxedEvaluation;
      this.cuts = cuts;
    }
    function sortByEvaluation(a, b) {
      return b.relaxedEvaluation - a.relaxedEvaluation;
    }
    Tableau.prototype.applyCuts = function(branchingCuts) {
      this.restore();
      this.addCutConstraints(branchingCuts);
      this.simplex();
      if (this.model.useMIRCuts) {
        var fractionalVolumeImproved = true;
        while (fractionalVolumeImproved) {
          var fractionalVolumeBefore = this.computeFractionalVolume(true);
          this.applyMIRCuts();
          this.simplex();
          var fractionalVolumeAfter = this.computeFractionalVolume(true);
          if (fractionalVolumeAfter >= 0.9 * fractionalVolumeBefore) {
            fractionalVolumeImproved = false;
          }
        }
      }
    };
    Tableau.prototype.branchAndCut = function() {
      var branches = [];
      var iterations = 0;
      var tolerance = this.model.tolerance;
      var toleranceFlag = true;
      var terminalTime = 1e99;
      if (this.model.timeout) {
        terminalTime = Date.now() + this.model.timeout;
      }
      var bestEvaluation = Infinity;
      var bestBranch = null;
      var bestOptionalObjectivesEvaluations = [];
      for (var oInit = 0; oInit < this.optionalObjectives.length; oInit += 1) {
        bestOptionalObjectivesEvaluations.push(Infinity);
      }
      var branch = new Branch(-Infinity, []);
      var acceptableThreshold;
      branches.push(branch);
      while (branches.length > 0 && toleranceFlag === true && Date.now() < terminalTime) {
        if (this.model.isMinimization) {
          acceptableThreshold = this.bestPossibleEval * (1 + tolerance);
        } else {
          acceptableThreshold = this.bestPossibleEval * (1 - tolerance);
        }
        if (tolerance > 0) {
          if (bestEvaluation < acceptableThreshold) {
            toleranceFlag = false;
          }
        }
        branch = branches.pop();
        if (branch.relaxedEvaluation > bestEvaluation) {
          continue;
        }
        var cuts = branch.cuts;
        this.applyCuts(cuts);
        iterations++;
        if (this.feasible === false) {
          continue;
        }
        var evaluation = this.evaluation;
        if (evaluation > bestEvaluation) {
          continue;
        }
        if (evaluation === bestEvaluation) {
          var isCurrentEvaluationWorse = true;
          for (var o = 0; o < this.optionalObjectives.length; o += 1) {
            if (this.optionalObjectives[o].reducedCosts[0] > bestOptionalObjectivesEvaluations[o]) {
              break;
            } else if (this.optionalObjectives[o].reducedCosts[0] < bestOptionalObjectivesEvaluations[o]) {
              isCurrentEvaluationWorse = false;
              break;
            }
          }
          if (isCurrentEvaluationWorse) {
            continue;
          }
        }
        if (this.isIntegral() === true) {
          this.__isIntegral = true;
          if (iterations === 1) {
            this.branchAndCutIterations = iterations;
            return;
          }
          bestBranch = branch;
          bestEvaluation = evaluation;
          for (var oCopy = 0; oCopy < this.optionalObjectives.length; oCopy += 1) {
            bestOptionalObjectivesEvaluations[oCopy] = this.optionalObjectives[oCopy].reducedCosts[0];
          }
        } else {
          if (iterations === 1) {
            this.save();
          }
          var variable = this.getMostFractionalVar();
          var varIndex = variable.index;
          var cutsHigh = [];
          var cutsLow = [];
          var nCuts = cuts.length;
          for (var c = 0; c < nCuts; c += 1) {
            var cut = cuts[c];
            if (cut.varIndex === varIndex) {
              if (cut.type === "min") {
                cutsLow.push(cut);
              } else {
                cutsHigh.push(cut);
              }
            } else {
              cutsHigh.push(cut);
              cutsLow.push(cut);
            }
          }
          var min2 = Math.ceil(variable.value);
          var max2 = Math.floor(variable.value);
          var cutHigh = new Cut("min", varIndex, min2);
          cutsHigh.push(cutHigh);
          var cutLow = new Cut("max", varIndex, max2);
          cutsLow.push(cutLow);
          branches.push(new Branch(evaluation, cutsHigh));
          branches.push(new Branch(evaluation, cutsLow));
          branches.sort(sortByEvaluation);
        }
      }
      if (bestBranch !== null) {
        this.applyCuts(bestBranch.cuts);
      }
      this.branchAndCutIterations = iterations;
    };
  }
});

// node_modules/javascript-lp-solver/src/Model.js
var require_Model = __commonJS({
  "node_modules/javascript-lp-solver/src/Model.js"(exports, module) {
    var Tableau = require_Tableau();
    var branchAndCut = require_branchAndCut();
    var expressions = require_expressions();
    var Constraint = expressions.Constraint;
    var Equality = expressions.Equality;
    var Variable = expressions.Variable;
    var IntegerVariable = expressions.IntegerVariable;
    var Term = expressions.Term;
    function Model(precision, name) {
      this.tableau = new Tableau(precision);
      this.name = name;
      this.variables = [];
      this.integerVariables = [];
      this.unrestrictedVariables = {};
      this.constraints = [];
      this.nConstraints = 0;
      this.nVariables = 0;
      this.isMinimization = true;
      this.tableauInitialized = false;
      this.relaxationIndex = 1;
      this.useMIRCuts = false;
      this.checkForCycles = true;
      this.messages = [];
    }
    module.exports = Model;
    Model.prototype.minimize = function() {
      this.isMinimization = true;
      return this;
    };
    Model.prototype.maximize = function() {
      this.isMinimization = false;
      return this;
    };
    Model.prototype._getNewElementIndex = function() {
      if (this.availableIndexes.length > 0) {
        return this.availableIndexes.pop();
      }
      var index = this.lastElementIndex;
      this.lastElementIndex += 1;
      return index;
    };
    Model.prototype._addConstraint = function(constraint) {
      var slackVariable = constraint.slack;
      this.tableau.variablesPerIndex[slackVariable.index] = slackVariable;
      this.constraints.push(constraint);
      this.nConstraints += 1;
      if (this.tableauInitialized === true) {
        this.tableau.addConstraint(constraint);
      }
    };
    Model.prototype.smallerThan = function(rhs) {
      var constraint = new Constraint(rhs, true, this.tableau.getNewElementIndex(), this);
      this._addConstraint(constraint);
      return constraint;
    };
    Model.prototype.greaterThan = function(rhs) {
      var constraint = new Constraint(rhs, false, this.tableau.getNewElementIndex(), this);
      this._addConstraint(constraint);
      return constraint;
    };
    Model.prototype.equal = function(rhs) {
      var constraintUpper = new Constraint(rhs, true, this.tableau.getNewElementIndex(), this);
      this._addConstraint(constraintUpper);
      var constraintLower = new Constraint(rhs, false, this.tableau.getNewElementIndex(), this);
      this._addConstraint(constraintLower);
      return new Equality(constraintUpper, constraintLower);
    };
    Model.prototype.addVariable = function(cost, id, isInteger, isUnrestricted, priority) {
      if (typeof priority === "string") {
        switch (priority) {
          case "required":
            priority = 0;
            break;
          case "strong":
            priority = 1;
            break;
          case "medium":
            priority = 2;
            break;
          case "weak":
            priority = 3;
            break;
          default:
            priority = 0;
            break;
        }
      }
      var varIndex = this.tableau.getNewElementIndex();
      if (id === null || id === void 0) {
        id = "v" + varIndex;
      }
      if (cost === null || cost === void 0) {
        cost = 0;
      }
      if (priority === null || priority === void 0) {
        priority = 0;
      }
      var variable;
      if (isInteger) {
        variable = new IntegerVariable(id, cost, varIndex, priority);
        this.integerVariables.push(variable);
      } else {
        variable = new Variable(id, cost, varIndex, priority);
      }
      this.variables.push(variable);
      this.tableau.variablesPerIndex[varIndex] = variable;
      if (isUnrestricted) {
        this.unrestrictedVariables[varIndex] = true;
      }
      this.nVariables += 1;
      if (this.tableauInitialized === true) {
        this.tableau.addVariable(variable);
      }
      return variable;
    };
    Model.prototype._removeConstraint = function(constraint) {
      var idx = this.constraints.indexOf(constraint);
      if (idx === -1) {
        console.warn("[Model.removeConstraint] Constraint not present in model");
        return;
      }
      this.constraints.splice(idx, 1);
      this.nConstraints -= 1;
      if (this.tableauInitialized === true) {
        this.tableau.removeConstraint(constraint);
      }
      if (constraint.relaxation) {
        this.removeVariable(constraint.relaxation);
      }
    };
    Model.prototype.removeConstraint = function(constraint) {
      if (constraint.isEquality) {
        this._removeConstraint(constraint.upperBound);
        this._removeConstraint(constraint.lowerBound);
      } else {
        this._removeConstraint(constraint);
      }
      return this;
    };
    Model.prototype.removeVariable = function(variable) {
      var idx = this.variables.indexOf(variable);
      if (idx === -1) {
        console.warn("[Model.removeVariable] Variable not present in model");
        return;
      }
      this.variables.splice(idx, 1);
      if (this.tableauInitialized === true) {
        this.tableau.removeVariable(variable);
      }
      return this;
    };
    Model.prototype.updateRightHandSide = function(constraint, difference) {
      if (this.tableauInitialized === true) {
        this.tableau.updateRightHandSide(constraint, difference);
      }
      return this;
    };
    Model.prototype.updateConstraintCoefficient = function(constraint, variable, difference) {
      if (this.tableauInitialized === true) {
        this.tableau.updateConstraintCoefficient(constraint, variable, difference);
      }
      return this;
    };
    Model.prototype.setCost = function(cost, variable) {
      var difference = cost - variable.cost;
      if (this.isMinimization === false) {
        difference = -difference;
      }
      variable.cost = cost;
      this.tableau.updateCost(variable, difference);
      return this;
    };
    Model.prototype.loadJson = function(jsonModel) {
      this.isMinimization = jsonModel.opType !== "max";
      var variables = jsonModel.variables;
      var constraints = jsonModel.constraints;
      var constraintsMin = {};
      var constraintsMax = {};
      var constraintIds = Object.keys(constraints);
      var nConstraintIds = constraintIds.length;
      for (var c = 0; c < nConstraintIds; c += 1) {
        var constraintId = constraintIds[c];
        var constraint = constraints[constraintId];
        var equal = constraint.equal;
        var weight = constraint.weight;
        var priority = constraint.priority;
        var relaxed = weight !== void 0 || priority !== void 0;
        var lowerBound, upperBound;
        if (equal === void 0) {
          var min2 = constraint.min;
          if (min2 !== void 0) {
            lowerBound = this.greaterThan(min2);
            constraintsMin[constraintId] = lowerBound;
            if (relaxed) {
              lowerBound.relax(weight, priority);
            }
          }
          var max2 = constraint.max;
          if (max2 !== void 0) {
            upperBound = this.smallerThan(max2);
            constraintsMax[constraintId] = upperBound;
            if (relaxed) {
              upperBound.relax(weight, priority);
            }
          }
        } else {
          lowerBound = this.greaterThan(equal);
          constraintsMin[constraintId] = lowerBound;
          upperBound = this.smallerThan(equal);
          constraintsMax[constraintId] = upperBound;
          var equality = new Equality(lowerBound, upperBound);
          if (relaxed) {
            equality.relax(weight, priority);
          }
        }
      }
      var variableIds = Object.keys(variables);
      var nVariables = variableIds.length;
      this.tolerance = jsonModel.tolerance || 0;
      if (jsonModel.timeout) {
        this.timeout = jsonModel.timeout;
      }
      if (jsonModel.options) {
        if (jsonModel.options.timeout) {
          this.timeout = jsonModel.options.timeout;
        }
        if (this.tolerance === 0) {
          this.tolerance = jsonModel.options.tolerance || 0;
        }
        if (jsonModel.options.useMIRCuts) {
          this.useMIRCuts = jsonModel.options.useMIRCuts;
        }
        if (typeof jsonModel.options.exitOnCycles === "undefined") {
          this.checkForCycles = true;
        } else {
          this.checkForCycles = jsonModel.options.exitOnCycles;
        }
      }
      var integerVarIds = jsonModel.ints || {};
      var binaryVarIds = jsonModel.binaries || {};
      var unrestrictedVarIds = jsonModel.unrestricted || {};
      var objectiveName = jsonModel.optimize;
      for (var v = 0; v < nVariables; v += 1) {
        var variableId = variableIds[v];
        var variableConstraints = variables[variableId];
        var cost = variableConstraints[objectiveName] || 0;
        var isBinary = !!binaryVarIds[variableId];
        var isInteger = !!integerVarIds[variableId] || isBinary;
        var isUnrestricted = !!unrestrictedVarIds[variableId];
        var variable = this.addVariable(cost, variableId, isInteger, isUnrestricted);
        if (isBinary) {
          this.smallerThan(1).addTerm(1, variable);
        }
        var constraintNames = Object.keys(variableConstraints);
        for (c = 0; c < constraintNames.length; c += 1) {
          var constraintName = constraintNames[c];
          if (constraintName === objectiveName) {
            continue;
          }
          var coefficient = variableConstraints[constraintName];
          var constraintMin = constraintsMin[constraintName];
          if (constraintMin !== void 0) {
            constraintMin.addTerm(coefficient, variable);
          }
          var constraintMax = constraintsMax[constraintName];
          if (constraintMax !== void 0) {
            constraintMax.addTerm(coefficient, variable);
          }
        }
      }
      return this;
    };
    Model.prototype.getNumberOfIntegerVariables = function() {
      return this.integerVariables.length;
    };
    Model.prototype.solve = function() {
      if (this.tableauInitialized === false) {
        this.tableau.setModel(this);
        this.tableauInitialized = true;
      }
      return this.tableau.solve();
    };
    Model.prototype.isFeasible = function() {
      return this.tableau.feasible;
    };
    Model.prototype.save = function() {
      return this.tableau.save();
    };
    Model.prototype.restore = function() {
      return this.tableau.restore();
    };
    Model.prototype.activateMIRCuts = function(useMIRCuts) {
      this.useMIRCuts = useMIRCuts;
    };
    Model.prototype.debug = function(debugCheckForCycles) {
      this.checkForCycles = debugCheckForCycles;
    };
    Model.prototype.log = function(message) {
      return this.tableau.log(message);
    };
  }
});

// node_modules/javascript-lp-solver/src/Validation.js
var require_Validation = __commonJS({
  "node_modules/javascript-lp-solver/src/Validation.js"(exports) {
    exports.CleanObjectiveAttributes = function(model) {
      var fakeAttr, x, z;
      if (typeof model.optimize === "string") {
        if (model.constraints[model.optimize]) {
          fakeAttr = Math.random();
          for (x in model.variables) {
            if (model.variables[x][model.optimize]) {
              model.variables[x][fakeAttr] = model.variables[x][model.optimize];
            }
          }
          model.constraints[fakeAttr] = model.constraints[model.optimize];
          delete model.constraints[model.optimize];
          return model;
        } else {
          return model;
        }
      } else {
        for (z in model.optimize) {
          if (model.constraints[z]) {
            if (model.constraints[z] === "equal") {
              delete model.optimize[z];
            } else {
              fakeAttr = Math.random();
              for (x in model.variables) {
                if (model.variables[x][z]) {
                  model.variables[x][fakeAttr] = model.variables[x][z];
                }
              }
              model.constraints[fakeAttr] = model.constraints[z];
              delete model.constraints[z];
            }
          }
        }
        return model;
      }
    };
  }
});

// node_modules/javascript-lp-solver/src/External/lpsolve/Reformat.js
var require_Reformat = __commonJS({
  "node_modules/javascript-lp-solver/src/External/lpsolve/Reformat.js"(exports, module) {
    function to_JSON(input) {
      var rxo = {
        "is_blank": /^\W{0,}$/,
        "is_objective": /(max|min)(imize){0,}\:/i,
        "is_int": /^(?!\/\*)\W{0,}int/i,
        "is_bin": /^(?!\/\*)\W{0,}bin/i,
        "is_constraint": /(\>|\<){0,}\=/i,
        "is_unrestricted": /^\S{0,}unrestricted/i,
        "parse_lhs": /(\-|\+){0,1}\s{0,1}\d{0,}\.{0,}\d{0,}\s{0,}[A-Za-z]\S{0,}/gi,
        "parse_rhs": /(\-|\+){0,1}\d{1,}\.{0,}\d{0,}\W{0,}\;{0,1}$/i,
        "parse_dir": /(\>|\<){0,}\=/gi,
        "parse_int": /[^\s|^\,]+/gi,
        "parse_bin": /[^\s|^\,]+/gi,
        "get_num": /(\-|\+){0,1}(\W|^)\d+\.{0,1}\d{0,}/g,
        "get_word": /[A-Za-z].*/
      }, model = {
        "opType": "",
        "optimize": "_obj",
        "constraints": {},
        "variables": {}
      }, constraints = {
        ">=": "min",
        "<=": "max",
        "=": "equal"
      }, tmp = "", tst = 0, ary = null, hldr = "", hldr2 = "", constraint = "", rhs = 0;
      if (typeof input === "string") {
        input = input.split("\n");
      }
      for (var i = 0; i < input.length; i++) {
        constraint = "__" + i;
        tmp = input[i];
        tst = 0;
        ary = null;
        if (rxo.is_objective.test(tmp)) {
          model.opType = tmp.match(/(max|min)/gi)[0];
          ary = tmp.match(rxo.parse_lhs).map(function(d) {
            return d.replace(/\s+/, "");
          }).slice(1);
          ary.forEach(function(d) {
            hldr = d.match(rxo.get_num);
            if (hldr === null) {
              if (d.substr(0, 1) === "-") {
                hldr = -1;
              } else {
                hldr = 1;
              }
            } else {
              hldr = hldr[0];
            }
            hldr = parseFloat(hldr);
            hldr2 = d.match(rxo.get_word)[0].replace(/\;$/, "");
            model.variables[hldr2] = model.variables[hldr2] || {};
            model.variables[hldr2]._obj = hldr;
          });
        } else if (rxo.is_int.test(tmp)) {
          ary = tmp.match(rxo.parse_int).slice(1);
          model.ints = model.ints || {};
          ary.forEach(function(d) {
            d = d.replace(";", "");
            model.ints[d] = 1;
          });
        } else if (rxo.is_bin.test(tmp)) {
          ary = tmp.match(rxo.parse_bin).slice(1);
          model.binaries = model.binaries || {};
          ary.forEach(function(d) {
            d = d.replace(";", "");
            model.binaries[d] = 1;
          });
        } else if (rxo.is_constraint.test(tmp)) {
          var separatorIndex = tmp.indexOf(":");
          var constraintExpression = separatorIndex === -1 ? tmp : tmp.slice(separatorIndex + 1);
          ary = constraintExpression.match(rxo.parse_lhs).map(function(d) {
            return d.replace(/\s+/, "");
          });
          ary.forEach(function(d) {
            hldr = d.match(rxo.get_num);
            if (hldr === null) {
              if (d.substr(0, 1) === "-") {
                hldr = -1;
              } else {
                hldr = 1;
              }
            } else {
              hldr = hldr[0];
            }
            hldr = parseFloat(hldr);
            hldr2 = d.match(rxo.get_word)[0];
            model.variables[hldr2] = model.variables[hldr2] || {};
            model.variables[hldr2][constraint] = hldr;
          });
          rhs = parseFloat(tmp.match(rxo.parse_rhs)[0]);
          tmp = constraints[tmp.match(rxo.parse_dir)[0]];
          model.constraints[constraint] = model.constraints[constraint] || {};
          model.constraints[constraint][tmp] = rhs;
        } else if (rxo.is_unrestricted.test(tmp)) {
          ary = tmp.match(rxo.parse_int).slice(1);
          model.unrestricted = model.unrestricted || {};
          ary.forEach(function(d) {
            d = d.replace(";", "");
            model.unrestricted[d] = 1;
          });
        }
      }
      return model;
    }
    function from_JSON(model) {
      if (!model) {
        throw new Error("Solver requires a model to operate on");
      }
      var output = "", ary = [], norm = 1, lookup = {
        "max": "<=",
        "min": ">=",
        "equal": "="
      }, rxClean = new RegExp("[^A-Za-z0-9_[{}/.&#$%~'@^]", "gi");
      if (model.opType) {
        output += model.opType + ":";
        for (var x in model.variables) {
          model.variables[x][x] = model.variables[x][x] ? model.variables[x][x] : 1;
          if (model.variables[x][model.optimize]) {
            output += " " + model.variables[x][model.optimize] + " " + x.replace(rxClean, "_");
          }
        }
      } else {
        output += "max:";
      }
      output += ";\n\n";
      for (var xx in model.constraints) {
        for (var y in model.constraints[xx]) {
          if (typeof lookup[y] !== "undefined") {
            for (var z in model.variables) {
              if (typeof model.variables[z][xx] !== "undefined") {
                output += " " + model.variables[z][xx] + " " + z.replace(rxClean, "_");
              }
            }
            output += " " + lookup[y] + " " + model.constraints[xx][y];
            output += ";\n";
          }
        }
      }
      if (model.ints) {
        output += "\n\n";
        for (var xxx in model.ints) {
          output += "int " + xxx.replace(rxClean, "_") + ";\n";
        }
      }
      if (model.unrestricted) {
        output += "\n\n";
        for (var xxxx in model.unrestricted) {
          output += "unrestricted " + xxxx.replace(rxClean, "_") + ";\n";
        }
      }
      return output;
    }
    module.exports = function(model) {
      if (model.length) {
        return to_JSON(model);
      } else {
        return from_JSON(model);
      }
    };
  }
});

// node_modules/javascript-lp-solver/src/External/lpsolve/main.js
var require_main = __commonJS({
  "node_modules/javascript-lp-solver/src/External/lpsolve/main.js"(exports) {
    exports.reformat = require_Reformat();
    function clean_data(data) {
      data = data.replace("\\r\\n", "\r\n");
      data = data.split("\r\n");
      data = data.filter(function(x) {
        var rx;
        rx = new RegExp(" 0$", "gi");
        if (rx.test(x) === true) {
          return false;
        }
        rx = new RegExp("\\d$", "gi");
        if (rx.test(x) === false) {
          return false;
        }
        return true;
      }).map(function(x) {
        return x.split(/\:{0,1} +(?=\d)/);
      }).reduce(function(o, k, i) {
        o[k[0]] = k[1];
        return o;
      }, {});
      return data;
    }
    exports.solve = function(model) {
      return new Promise(function(res, rej) {
        if (typeof window !== "undefined") {
          rej("Function Not Available in Browser");
        }
        var data = require_Reformat()(model);
        if (!model.external) {
          rej("Data for this function must be contained in the 'external' attribute. Not seeing anything there.");
        }
        if (!model.external.binPath) {
          rej("No Executable | Binary path provided in arguments as 'binPath'");
        }
        if (!model.external.args) {
          rej("No arguments array for cli | bash provided on 'args' attribute");
        }
        if (!model.external.tempName) {
          rej("No 'tempName' given. This is necessary to produce a staging file for the solver to operate on");
        }
        var fs = __require("fs");
        fs.writeFile(model.external.tempName, data, function(fe, fd) {
          if (fe) {
            rej(fe);
          } else {
            var exec = __require("child_process").execFile;
            model.external.args.push(model.external.tempName);
            exec(model.external.binPath, model.external.args, function(e, data2) {
              if (e) {
                if (e.code === 1) {
                  res(clean_data(data2));
                } else {
                  var codes = {
                    "-2": "Out of Memory",
                    "1": "SUBOPTIMAL",
                    "2": "INFEASIBLE",
                    "3": "UNBOUNDED",
                    "4": "DEGENERATE",
                    "5": "NUMFAILURE",
                    "6": "USER-ABORT",
                    "7": "TIMEOUT",
                    "9": "PRESOLVED",
                    "25": "ACCURACY ERROR",
                    "255": "FILE-ERROR"
                  };
                  var ret_obj = {
                    "code": e.code,
                    "meaning": codes[e.code],
                    "data": data2
                  };
                  rej(ret_obj);
                }
              } else {
                res(clean_data(data2));
              }
            });
          }
        });
      });
    };
  }
});

// node_modules/javascript-lp-solver/src/External/main.js
var require_main2 = __commonJS({
  "node_modules/javascript-lp-solver/src/External/main.js"(exports, module) {
    module.exports = {
      "lpsolve": require_main()
    };
  }
});

// node_modules/javascript-lp-solver/src/Polyopt.js
var require_Polyopt = __commonJS({
  "node_modules/javascript-lp-solver/src/Polyopt.js"(exports, module) {
    module.exports = function(solver, model) {
      var objectives = model.optimize, new_constraints = JSON.parse(JSON.stringify(model.optimize)), keys = Object.keys(model.optimize), tmp, counter = 0, vectors = {}, vector_key = "", obj = {}, pareto = [], i, j, x, y, z;
      delete model.optimize;
      for (i = 0; i < keys.length; i++) {
        new_constraints[keys[i]] = 0;
      }
      for (i = 0; i < keys.length; i++) {
        model.optimize = keys[i];
        model.opType = objectives[keys[i]];
        tmp = solver.Solve(model, void 0, void 0, true);
        for (y in keys) {
          if (!model.variables[keys[y]]) {
            tmp[keys[y]] = tmp[keys[y]] ? tmp[keys[y]] : 0;
            for (x in model.variables) {
              if (model.variables[x][keys[y]] && tmp[x]) {
                tmp[keys[y]] += tmp[x] * model.variables[x][keys[y]];
              }
            }
          }
        }
        vector_key = "base";
        for (j = 0; j < keys.length; j++) {
          if (tmp[keys[j]]) {
            vector_key += "-" + (tmp[keys[j]] * 1e3 | 0) / 1e3;
          } else {
            vector_key += "-0";
          }
        }
        if (!vectors[vector_key]) {
          vectors[vector_key] = 1;
          counter++;
          for (j = 0; j < keys.length; j++) {
            if (tmp[keys[j]]) {
              new_constraints[keys[j]] += tmp[keys[j]];
            }
          }
          delete tmp.feasible;
          delete tmp.result;
          pareto.push(tmp);
        }
      }
      for (i = 0; i < keys.length; i++) {
        model.constraints[keys[i]] = { "equal": new_constraints[keys[i]] / counter };
      }
      model.optimize = "cheater-" + Math.random();
      model.opType = "max";
      for (i in model.variables) {
        model.variables[i].cheater = 1;
      }
      for (i in pareto) {
        for (x in pareto[i]) {
          obj[x] = obj[x] || { min: 1e99, max: -1e99 };
        }
      }
      for (i in obj) {
        for (x in pareto) {
          if (pareto[x][i]) {
            if (pareto[x][i] > obj[i].max) {
              obj[i].max = pareto[x][i];
            }
            if (pareto[x][i] < obj[i].min) {
              obj[i].min = pareto[x][i];
            }
          } else {
            pareto[x][i] = 0;
            obj[i].min = 0;
          }
        }
      }
      tmp = solver.Solve(model, void 0, void 0, true);
      return {
        midpoint: tmp,
        vertices: pareto,
        ranges: obj
      };
    };
  }
});

// node_modules/javascript-lp-solver/src/main.js
var require_main3 = __commonJS({
  "node_modules/javascript-lp-solver/src/main.js"(exports, module) {
    var Tableau = require_Tableau2();
    var Model = require_Model();
    var branchAndCut = require_branchAndCut();
    var expressions = require_expressions();
    var validation = require_Validation();
    var Constraint = expressions.Constraint;
    var Variable = expressions.Variable;
    var Numeral = expressions.Numeral;
    var Term = expressions.Term;
    var External = require_main2();
    var Solver = function() {
      "use strict";
      this.Model = Model;
      this.branchAndCut = branchAndCut;
      this.Constraint = Constraint;
      this.Variable = Variable;
      this.Numeral = Numeral;
      this.Term = Term;
      this.Tableau = Tableau;
      this.lastSolvedModel = null;
      this.External = External;
      this.Solve = function(model, precision, full, validate) {
        if (validate) {
          for (var test in validation) {
            model = validation[test](model);
          }
        }
        if (!model) {
          throw new Error("Solver requires a model to operate on");
        }
        if (typeof model.optimize === "object") {
          if (Object.keys(model.optimize > 1)) {
            return require_Polyopt()(this, model);
          }
        }
        if (model.external) {
          var solvers = Object.keys(External);
          solvers = JSON.stringify(solvers);
          if (!model.external.solver) {
            throw new Error("The model you provided has an 'external' object that doesn't have a solver attribute. Use one of the following:" + solvers);
          }
          if (!External[model.external.solver]) {
            throw new Error("No support (yet) for " + model.external.solver + ". Please use one of these instead:" + solvers);
          }
          return External[model.external.solver].solve(model);
        } else {
          if (model instanceof Model === false) {
            model = new Model(precision).loadJson(model);
          }
          var solution = model.solve();
          this.lastSolvedModel = model;
          solution.solutionSet = solution.generateSolutionSet();
          if (full) {
            return solution;
          } else {
            var store = {};
            store.feasible = solution.feasible;
            store.result = solution.evaluation;
            store.bounded = solution.bounded;
            if (solution._tableau.__isIntegral) {
              store.isIntegral = true;
            }
            Object.keys(solution.solutionSet).forEach(function(d) {
              if (solution.solutionSet[d] !== 0) {
                store[d] = solution.solutionSet[d];
              }
            });
            return store;
          }
        }
      };
      this.ReformatLP = require_Reformat();
      this.MultiObjective = function(model) {
        return require_Polyopt()(this, model);
      };
    };
    if (typeof define === "function") {
      define([], function() {
        return new Solver();
      });
    } else if (typeof window === "object") {
      window.solver = new Solver();
    } else if (typeof self === "object") {
      self.solver = new Solver();
    }
    module.exports = new Solver();
  }
});

// node_modules/fastpriorityqueue/FastPriorityQueue.js
var require_FastPriorityQueue = __commonJS({
  "node_modules/fastpriorityqueue/FastPriorityQueue.js"(exports, module) {
    "use strict";
    var defaultcomparator = function(a, b) {
      return a < b;
    };
    function FastPriorityQueue2(comparator) {
      if (!(this instanceof FastPriorityQueue2))
        return new FastPriorityQueue2(comparator);
      this.array = [];
      this.size = 0;
      this.compare = comparator || defaultcomparator;
    }
    FastPriorityQueue2.prototype.clone = function() {
      var fpq = new FastPriorityQueue2(this.compare);
      fpq.size = this.size;
      fpq.array = this.array.slice(0, this.size);
      return fpq;
    };
    FastPriorityQueue2.prototype.add = function(myval) {
      var i = this.size;
      this.array[this.size] = myval;
      this.size += 1;
      var p;
      var ap;
      while (i > 0) {
        p = i - 1 >> 1;
        ap = this.array[p];
        if (!this.compare(myval, ap)) {
          break;
        }
        this.array[i] = ap;
        i = p;
      }
      this.array[i] = myval;
    };
    FastPriorityQueue2.prototype.heapify = function(arr) {
      this.array = arr;
      this.size = arr.length;
      var i;
      for (i = this.size >> 1; i >= 0; i--) {
        this._percolateDown(i);
      }
    };
    FastPriorityQueue2.prototype._percolateUp = function(i, force) {
      var myval = this.array[i];
      var p;
      var ap;
      while (i > 0) {
        p = i - 1 >> 1;
        ap = this.array[p];
        if (!force && !this.compare(myval, ap)) {
          break;
        }
        this.array[i] = ap;
        i = p;
      }
      this.array[i] = myval;
    };
    FastPriorityQueue2.prototype._percolateDown = function(i) {
      var size = this.size;
      var hsize = this.size >>> 1;
      var ai = this.array[i];
      var l;
      var r;
      var bestc;
      while (i < hsize) {
        l = (i << 1) + 1;
        r = l + 1;
        bestc = this.array[l];
        if (r < size) {
          if (this.compare(this.array[r], bestc)) {
            l = r;
            bestc = this.array[r];
          }
        }
        if (!this.compare(bestc, ai)) {
          break;
        }
        this.array[i] = bestc;
        i = l;
      }
      this.array[i] = ai;
    };
    FastPriorityQueue2.prototype._removeAt = function(index) {
      if (index > this.size - 1 || index < 0)
        return void 0;
      this._percolateUp(index, true);
      return this.poll();
    };
    FastPriorityQueue2.prototype.remove = function(myval) {
      for (var i = 0; i < this.size; i++) {
        if (!this.compare(this.array[i], myval) && !this.compare(myval, this.array[i])) {
          this._removeAt(i);
          return true;
        }
      }
      return false;
    };
    FastPriorityQueue2.prototype.removeOne = function(callback) {
      if (typeof callback !== "function") {
        return void 0;
      }
      for (var i = 0; i < this.size; i++) {
        if (callback(this.array[i])) {
          return this._removeAt(i);
        }
      }
    };
    FastPriorityQueue2.prototype.removeMany = function(callback, limit) {
      if (typeof callback !== "function" || this.size < 1) {
        return [];
      }
      limit = limit ? Math.min(limit, this.size) : this.size;
      var resultSize = 0;
      var result = new Array(limit);
      var tmpSize = 0;
      var tmp = new Array(this.size);
      while (resultSize < limit && !this.isEmpty()) {
        var item = this.poll();
        if (callback(item)) {
          result[resultSize++] = item;
        } else {
          tmp[tmpSize++] = item;
        }
      }
      result.length = resultSize;
      var i = 0;
      while (i < tmpSize) {
        this.add(tmp[i++]);
      }
      return result;
    };
    FastPriorityQueue2.prototype.peek = function() {
      if (this.size == 0)
        return void 0;
      return this.array[0];
    };
    FastPriorityQueue2.prototype.poll = function() {
      if (this.size == 0)
        return void 0;
      var ans = this.array[0];
      if (this.size > 1) {
        this.array[0] = this.array[--this.size];
        this._percolateDown(0);
      } else {
        this.size -= 1;
      }
      return ans;
    };
    FastPriorityQueue2.prototype.replaceTop = function(myval) {
      if (this.size == 0)
        return void 0;
      var ans = this.array[0];
      this.array[0] = myval;
      this._percolateDown(0);
      return ans;
    };
    FastPriorityQueue2.prototype.trim = function() {
      this.array = this.array.slice(0, this.size);
    };
    FastPriorityQueue2.prototype.isEmpty = function() {
      return this.size === 0;
    };
    FastPriorityQueue2.prototype.forEach = function(callback) {
      if (this.isEmpty() || typeof callback != "function")
        return;
      var i = 0;
      var fpq = this.clone();
      while (!fpq.isEmpty()) {
        callback(fpq.poll(), i++);
      }
    };
    FastPriorityQueue2.prototype.kSmallest = function(k) {
      if (this.size == 0)
        return [];
      k = Math.min(this.size, k);
      var fpq = new FastPriorityQueue2(this.compare);
      const newSize = Math.min((k > 0 ? Math.pow(2, k - 1) : 0) + 1, this.size);
      fpq.size = newSize;
      fpq.array = this.array.slice(0, newSize);
      var smallest = new Array(k);
      for (var i = 0; i < k; i++) {
        smallest[i] = fpq.poll();
      }
      return smallest;
    };
    module.exports = FastPriorityQueue2;
  }
});

// dist/iters.js
var import_denque = __toModule(require_denque());
var LazyFluentIterable = class {
  constructor(base) {
    this.base = base;
  }
  [Symbol.iterator]() {
    return this.base[Symbol.iterator]();
  }
  *gconcat(...others) {
    yield* this;
    for (const iter of others) {
      yield* iter;
    }
  }
  concat(...others) {
    return fluent(this.gconcat(...others));
  }
  *gentries() {
    let index = 0;
    for (const element of this) {
      yield [index++, element];
    }
  }
  entries() {
    return fluent(this.gentries());
  }
  every(callback) {
    return !this.some((elem, ind) => !callback(elem, ind));
  }
  fill(val) {
    return this.map(() => val);
  }
  *gfilter(callback) {
    for (const [index, element] of this.gentries()) {
      if (callback(element, index)) {
        yield element;
      }
    }
  }
  filter(callback) {
    return fluent(this.gfilter(callback));
  }
  find(callback) {
    return this.filter(callback).shift();
  }
  findIndex(callback) {
    for (const [index, element] of this.gentries()) {
      if (callback(element, index)) {
        return index;
      }
    }
    return -1;
  }
  *gflatMap(callback) {
    for (const [index, element] of this.gentries()) {
      yield* callback(element, index);
    }
  }
  flatMap(callback) {
    return fluent(this.gflatMap(callback));
  }
  forEach(callback) {
    for (const [index, element] of this.gentries()) {
      callback(element, index);
    }
  }
  includes(query, fromIndex = 0) {
    return this.indexOf(query, fromIndex) >= 0;
  }
  indexOf(query, fromIndex = 0) {
    if (fromIndex < 0) {
      let index = 0;
      const queue = new import_denque.default();
      for (const elem of this) {
        if (index >= -fromIndex) {
          queue.shift();
        }
        queue.push(elem);
        index++;
      }
      const ind = queue.toArray().indexOf(query);
      if (ind === -1) {
        return -1;
      } else {
        return ind + index + fromIndex;
      }
    } else {
      for (const [index, element] of this.gentries()) {
        if (index >= fromIndex && element === query) {
          return index;
        }
      }
      return -1;
    }
  }
  join(separator = ",") {
    return [...this].join(separator);
  }
  *gkeys() {
    let index = 0;
    for (const _ of this) {
      yield index++;
    }
  }
  keys() {
    return fluent(this.gkeys());
  }
  lastIndexOf(query, fromIndex = Infinity) {
    let lastIndex = -1;
    if (fromIndex < 0) {
      const queue = new import_denque.default();
      for (const [index, element] of this.gentries()) {
        if (element === query) {
          queue.push(index);
        }
        const next = queue.peekFront();
        if (next !== void 0 && next <= index + fromIndex + 1) {
          queue.shift();
          lastIndex = next;
        }
      }
    } else {
      for (const [index, element] of this.gentries()) {
        if (index <= fromIndex && element === query) {
          lastIndex = index;
        }
      }
    }
    return lastIndex;
  }
  get length() {
    return this.reduce((a) => a + 1, 0);
  }
  *gmap(callback) {
    for (const [index, element] of this.gentries()) {
      yield callback(element, index);
    }
  }
  map(callback) {
    return fluent(this.gmap(callback));
  }
  pop() {
    let last;
    for (last of this) {
    }
    return last;
  }
  push(...items) {
    return this.concat(items);
  }
  reduce(callback, initialValue) {
    if (initialValue === void 0) {
      const call = callback;
      let first = true;
      let accumulator = void 0;
      for (const [index, element] of this.gentries()) {
        if (first) {
          accumulator = element;
          first = false;
        } else {
          accumulator = call(accumulator, element, index);
        }
      }
      if (first) {
        throw new TypeError("Reduce of empty iterable with no initial value");
      }
      return accumulator;
    } else {
      const call = callback;
      let accumulator = initialValue;
      for (const [index, element] of this.gentries()) {
        accumulator = call(accumulator, element, index);
      }
      return accumulator;
    }
  }
  reverse() {
    return fluent([...this].reverse());
  }
  shift() {
    for (const val of this) {
      return val;
    }
    return void 0;
  }
  *gslice(start, end) {
    for (const [index, element] of this.gentries()) {
      if (index >= end) {
        break;
      } else if (index >= start) {
        yield element;
      }
    }
  }
  *gnegslice(start, end) {
    const queue = new import_denque.default();
    const pop = start - end;
    for (const [index, elem] of this.gentries()) {
      if (index >= pop) {
        yield queue.shift();
        queue.push(elem);
      } else if (index >= start) {
        queue.push(elem);
      }
    }
  }
  slice(start = 0, end = Infinity) {
    if (start < 0) {
      let index = 0;
      const queue = new import_denque.default();
      for (const elem of this) {
        if (index >= -start) {
          queue.shift();
        }
        queue.push(elem);
        index++;
      }
      const array = queue.toArray();
      const num = end - index - start;
      if (end < 0) {
        return fluent(array.slice(0, end));
      } else if (num > 0) {
        return fluent(array.slice(0, num));
      } else {
        return fluent();
      }
    } else if (end < 0) {
      return fluent(this.gnegslice(start, end));
    } else {
      return fluent(this.gslice(start, end));
    }
  }
  some(callback) {
    for (const [index, element] of this.gentries()) {
      if (callback(element, index)) {
        return true;
      }
    }
    return false;
  }
  sort(compare) {
    return fluent([...this].sort(compare));
  }
  *gsplice(start, deleteCount, ...items) {
    for (const [index, element] of this.gentries()) {
      if (index === start) {
        yield* items;
      }
      if (index < start || index >= start + deleteCount) {
        yield element;
      }
    }
  }
  splice(start, deleteCount = 0, ...items) {
    return fluent(this.gsplice(start, deleteCount, ...items));
  }
  unshift(...items) {
    return fluent(items).concat(this);
  }
  values() {
    return this;
  }
};
function fluent(seq = []) {
  return new LazyFluentIterable(seq);
}

// dist/utils.js
function def(val) {
  if (val !== void 0) {
    return val;
  } else {
    throw new Error("internal error: got unexpected undefined value");
  }
}
function assert(statement) {
  if (!statement) {
    throw new Error("internal error: failed assert");
  }
}
function setIntersect(first, second) {
  if (second.size < first.size) {
    [second, first] = [first, second];
  }
  for (const element of first) {
    if (second.has(element)) {
      return true;
    }
  }
  return false;
}
function getCircularReplacer() {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[circular]";
      }
      seen.add(value);
    }
    return value;
  };
}
function js(strings, ...values) {
  const [base, ...rest] = strings;
  return [base].concat(...rest.map((str, i) => [
    JSON.stringify(values[i], getCircularReplacer()),
    str
  ])).join("");
}
function* bigrams(array) {
  let [first, ...rest] = array;
  for (const second of rest) {
    yield [first, second];
    first = second;
  }
}
function* dfs(children, ...queue) {
  const seen = new Set();
  let node;
  while (node = queue.pop()) {
    if (seen.has(node))
      continue;
    yield node;
    seen.add(node);
    queue.push(...children(node));
  }
}

// dist/dag/create.js
var __rest = undefined && undefined.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
var LayoutChildLink = class {
  constructor(child, data, points = []) {
    this.child = child;
    this.data = data;
    this.points = points;
  }
};
var LayoutLink = class {
  constructor(source, target, data, points) {
    this.source = source;
    this.target = target;
    this.data = data;
    this.points = points;
  }
};
var LayoutDag = class {
  constructor(roots) {
    if (roots) {
      this.proots = roots;
    }
  }
  [Symbol.iterator]() {
    return this.idescendants()[Symbol.iterator]();
  }
  iroots() {
    return fluent(def(this.proots));
  }
  roots() {
    return [...this.iroots()];
  }
  *gdepth() {
    const ch = (node) => node.ichildren();
    yield* dfs(ch, ...this.iroots());
  }
  *gbreadth() {
    const seen = new Set();
    let next = this.roots();
    let current = [];
    do {
      current = next.reverse();
      next = [];
      let node;
      while (node = current.pop()) {
        if (!seen.has(node)) {
          seen.add(node);
          yield node;
          next.push(...node.ichildren());
        }
      }
    } while (next.length);
  }
  *gbefore() {
    const numBefore = new Map();
    for (const node2 of this) {
      for (const child of node2.ichildren()) {
        numBefore.set(child, (numBefore.get(child) || 0) + 1);
      }
    }
    const queue = this.roots();
    let node;
    while (node = queue.pop()) {
      yield node;
      for (const child of node.ichildren()) {
        const before = def(numBefore.get(child));
        if (before > 1) {
          numBefore.set(child, before - 1);
        } else {
          queue.push(child);
        }
      }
    }
  }
  *gafter() {
    const queue = this.roots();
    const seen = new Set();
    let node;
    while (node = queue.pop()) {
      if (seen.has(node)) {
      } else if (node.ichildren().every((c) => seen.has(c))) {
        seen.add(node);
        yield node;
      } else {
        queue.push(node);
        queue.push(...node.ichildren());
      }
    }
  }
  idescendants(style = "depth") {
    if (style === "depth") {
      return fluent(this.gdepth());
    } else if (style === "breadth") {
      return fluent(this.gbreadth());
    } else if (style === "before") {
      return fluent(this.gbefore());
    } else if (style === "after") {
      return fluent(this.gafter());
    } else {
      throw new Error(`unknown iteration style: ${style}`);
    }
  }
  descendants(style = "depth") {
    return [...this.idescendants(style)];
  }
  ilinks() {
    return this.idescendants().flatMap((node) => node.ichildLinks());
  }
  links() {
    return [...this.ilinks()];
  }
  size() {
    return this.idescendants().reduce((s) => s + 1, 0);
  }
  sum(callback) {
    const descendantVals = new Map();
    for (const [index, node] of this.idescendants("after").entries()) {
      const val = callback(node, index);
      const nodeVals = new Map();
      nodeVals.set(node, val);
      for (const child of node.ichildren()) {
        const childMap = def(descendantVals.get(child));
        for (const [child2, v] of childMap.entries()) {
          nodeVals.set(child2, v);
        }
      }
      node.value = fluent(nodeVals.values()).reduce((a, b) => a + b);
      descendantVals.set(node, nodeVals);
    }
    return this;
  }
  count() {
    const leaves = new Map();
    for (const node of this.idescendants("after")) {
      if (node.ichildren()[Symbol.iterator]().next().done) {
        leaves.set(node, new Set([node]));
        node.value = 1;
      } else {
        const nodeLeaves = new Set();
        for (const child of node.ichildren()) {
          const childLeaves = def(leaves.get(child));
          for (const leaf of childLeaves) {
            nodeLeaves.add(leaf);
          }
        }
        leaves.set(node, nodeLeaves);
        node.value = nodeLeaves.size;
      }
    }
    return this;
  }
  height() {
    for (const node of this.idescendants("after")) {
      node.value = Math.max(0, ...node.ichildren().map((child) => def(child.value) + 1));
    }
    return this;
  }
  depth() {
    const parents = new Map();
    for (const node of this) {
      for (const child of node.ichildren()) {
        const pars = parents.get(child);
        if (pars) {
          pars.push(node);
        } else {
          parents.set(child, [node]);
        }
      }
    }
    for (const node of this.idescendants("before")) {
      node.value = Math.max(0, ...(parents.get(node) || []).map((par) => def(par.value) + 1));
    }
    return this;
  }
  *gsplit() {
    const parents = new Map();
    for (const node of this) {
      for (const child of node.ichildren()) {
        const pars = parents.get(child);
        if (pars) {
          pars.push(node);
        } else {
          parents.set(child, [node]);
        }
      }
    }
    function* graph(node) {
      yield* node.ichildren();
      yield* parents.get(node) || [];
    }
    const available = new Set(this.iroots());
    for (const root of this.iroots()) {
      if (!available.delete(root))
        continue;
      const connected = [root];
      for (const node of dfs(graph, root)) {
        if (available.delete(node)) {
          connected.push(node);
        }
      }
      yield connected.length > 1 ? new LayoutDag(connected) : connected[0];
    }
  }
  isplit() {
    return fluent(this.gsplit());
  }
  split() {
    return [...this.isplit()];
  }
  connected() {
    const iter = this.isplit()[Symbol.iterator]();
    let { done } = iter.next();
    assert(!done);
    ({ done } = iter.next());
    return !!done;
  }
};
var LayoutDagNode = class extends LayoutDag {
  constructor(data) {
    super();
    this.data = data;
    this.dataChildren = [];
  }
  iroots() {
    return fluent([this]);
  }
  *gchildren() {
    for (const { child } of this.dataChildren) {
      yield child;
    }
  }
  ichildren() {
    return fluent(this.gchildren());
  }
  children() {
    return [...this.ichildren()];
  }
  *gchildLinks() {
    for (const { child, data, points } of this.dataChildren) {
      yield new LayoutLink(this, child, data, points);
    }
  }
  ichildLinks() {
    return fluent(this.gchildLinks());
  }
  childLinks() {
    return [...this.ichildLinks()];
  }
  isplit() {
    return fluent([this]);
  }
  split() {
    return [this];
  }
  connected() {
    return true;
  }
};
function verifyId(id) {
  if (typeof id !== "string") {
    throw new Error(`id is supposed to be string but got type ${typeof id}`);
  }
  return id;
}
function verifyDag(roots) {
  if (!roots.length) {
    throw new Error("dag contained no roots; this often indicates a cycle");
  }
  for (const node of new LayoutDag(roots)) {
    const childIdSet = new Set(node.ichildren());
    if (childIdSet.size !== node.ichildren().length) {
      throw new Error(js`node '${node.data}' contained duplicate children`);
    }
  }
  const seen = new Set();
  const past = new Set();
  let rec = null;
  function visit(node) {
    if (seen.has(node)) {
      return [];
    } else if (past.has(node)) {
      rec = node;
      return [node];
    } else {
      past.add(node);
      let result = [];
      for (const child of node.ichildren()) {
        result = visit(child);
        if (result.length)
          break;
      }
      past.delete(node);
      seen.add(node);
      if (result.length && rec !== null)
        result.push(node);
      if (rec === node)
        rec = null;
      return result;
    }
  }
  for (const root of roots) {
    const msg = visit(root);
    if (msg.length) {
      const cycle = msg.reverse().map(({ data }) => js`'${data}'`).join(" -> ");
      throw new Error(`dag contained a cycle: ${cycle}`);
    }
  }
}
function buildConnect(operators) {
  function connect2(data) {
    if (!data.length) {
      throw new Error("can't connect empty data");
    }
    const nodes = new Map();
    const hasParents = new Set();
    for (const [i, datum] of data.entries()) {
      const source = verifyId(operators.sourceId(datum, i));
      let sourceNode = nodes.get(source);
      if (sourceNode === void 0) {
        sourceNode = new LayoutDagNode({ id: source });
        nodes.set(source, sourceNode);
      }
      const target = verifyId(operators.targetId(datum, i));
      let targetNode = nodes.get(target);
      if (targetNode === void 0) {
        targetNode = new LayoutDagNode({ id: target });
        nodes.set(target, targetNode);
      }
      if (source !== target || !operators.single) {
        sourceNode.dataChildren.push(new LayoutChildLink(targetNode, datum));
        hasParents.add(target);
      }
    }
    const roots = [];
    for (const [id, node] of nodes.entries()) {
      if (!hasParents.has(id)) {
        roots.push(node);
      }
    }
    verifyDag(roots);
    return roots.length > 1 ? new LayoutDag(roots) : roots[0];
  }
  function sourceId(id) {
    if (id === void 0) {
      return operators.sourceId;
    } else {
      const { sourceId: _ } = operators, rest = __rest(operators, ["sourceId"]);
      return buildConnect(Object.assign(Object.assign({}, rest), { sourceId: id }));
    }
  }
  connect2.sourceId = sourceId;
  function targetId(id) {
    if (id === void 0) {
      return operators.targetId;
    } else {
      const { targetId: _ } = operators, rest = __rest(operators, ["targetId"]);
      return buildConnect(Object.assign(Object.assign({}, rest), { targetId: id }));
    }
  }
  connect2.targetId = targetId;
  function single(val) {
    if (val === void 0) {
      return operators.single;
    } else {
      return buildConnect(Object.assign(Object.assign({}, operators), { single: val }));
    }
  }
  connect2.single = single;
  return connect2;
}
function isZeroString(d) {
  try {
    return typeof d[0] === "string";
  } catch (_a) {
    return false;
  }
}
function defaultSourceId(d) {
  if (isZeroString(d)) {
    return d[0];
  } else {
    throw new Error(`default source id expected datum[0] to be a string but got datum: ${d}`);
  }
}
function isOneString(d) {
  try {
    return typeof d[1] === "string";
  } catch (_a) {
    return false;
  }
}
function defaultTargetId(d) {
  if (isOneString(d)) {
    return d[1];
  } else {
    throw new Error(`default target id expected datum[1] to be a string but got datum: ${d}`);
  }
}
function connect(...args) {
  if (args.length) {
    throw new Error(`got arguments to connect(${args}), but constructor takes no aruguments. These were probably meant as data which should be called as connect()(...)`);
  } else {
    return buildConnect({
      sourceId: defaultSourceId,
      targetId: defaultTargetId,
      single: false
    });
  }
}
function buildHierarchy(operators) {
  function hierarchy2(...data) {
    if (!data.length) {
      throw new Error("must pass in at least one node");
    }
    const mapping = new Map();
    const queue = [];
    function nodify(datum) {
      let node2 = mapping.get(datum);
      if (node2 === void 0) {
        node2 = new LayoutDagNode(datum);
        mapping.set(datum, node2);
        queue.push(node2);
      }
      return node2;
    }
    const roots2 = data.map(nodify);
    let node;
    let i = 0;
    while (node = queue.pop()) {
      node.dataChildren = (operators.childrenData(node.data, i++) || []).map(([childDatum, linkDatum]) => new LayoutChildLink(nodify(childDatum), linkDatum));
    }
    const rootSet = new Set(roots2);
    for (const node2 of mapping.values()) {
      for (const child of node2.ichildren()) {
        if (rootSet.delete(child) && operators.roots) {
          throw new Error(js`node '${node2.data}' pointed to a root`);
        }
      }
    }
    const froots = rootSet.size && rootSet.size !== roots2.length ? [...rootSet] : roots2;
    verifyDag(froots);
    return froots.length > 1 ? new LayoutDag(froots) : froots[0];
  }
  function children(childs) {
    if (childs === void 0) {
      return operators.children;
    } else {
      return buildHierarchy({
        children: childs,
        childrenData: wrapChildren(childs),
        roots: operators.roots
      });
    }
  }
  hierarchy2.children = children;
  function childrenData(data) {
    if (data === void 0) {
      return operators.childrenData;
    } else {
      return buildHierarchy({
        children: wrapChildrenData(data),
        childrenData: data,
        roots: operators.roots
      });
    }
  }
  hierarchy2.childrenData = childrenData;
  function roots(val) {
    if (val === void 0) {
      return operators.roots;
    } else {
      return buildHierarchy(Object.assign(Object.assign({}, operators), { roots: val }));
    }
  }
  hierarchy2.roots = roots;
  return hierarchy2;
}
function wrapChildren(children) {
  function wrapped(d, i) {
    return (children(d, i) || []).map((d2) => [d2, void 0]);
  }
  wrapped.wrapped = children;
  return wrapped;
}
function wrapChildrenData(childrenData) {
  function wrapped(d, i) {
    return (childrenData(d, i) || []).map(([d2]) => d2);
  }
  wrapped.wrapped = childrenData;
  return wrapped;
}
function hasChildren(d) {
  try {
    const children = d.children;
    return children === void 0 || children instanceof Array;
  } catch (_a) {
    return false;
  }
}
function defaultChildren(d) {
  if (hasChildren(d)) {
    return d.children;
  } else {
    throw new Error(js`default children function expected datum to have a children field but got: ${d}`);
  }
}
function hierarchy(...args) {
  if (args.length) {
    throw new Error(`got arguments to hierarchy(${args}), but constructor takes no aruguments. These were probably meant as data which should be called as hierarchy()(...)`);
  } else {
    return buildHierarchy({
      children: defaultChildren,
      childrenData: wrapChildren(defaultChildren),
      roots: true
    });
  }
}
function buildStratify(operators) {
  function stratify2(data) {
    if (!data.length)
      throw new Error("can't stratify empty data");
    const mapping = new Map();
    for (const [i, datum] of data.entries()) {
      const nid = verifyId(operators.id(datum, i));
      const pdata = operators.parentData(datum, i) || [];
      const node = new LayoutDagNode(datum);
      if (mapping.has(nid)) {
        throw new Error(`found a duplicate id: ${id}`);
      } else {
        mapping.set(nid, [node, pdata]);
      }
    }
    const roots = [];
    for (const [node, pdata] of mapping.values()) {
      for (const [pid, linkData] of pdata) {
        const info = mapping.get(pid);
        if (!info)
          throw new Error(`missing id: ${pid}`);
        const [par] = info;
        par.dataChildren.push(new LayoutChildLink(node, linkData));
      }
      if (!pdata.length) {
        roots.push(node);
      }
    }
    verifyDag(roots);
    return roots.length > 1 ? new LayoutDag(roots) : roots[0];
  }
  function id(op) {
    if (op === void 0) {
      return operators.id;
    } else {
      const { id: _ } = operators, rest = __rest(operators, ["id"]);
      return buildStratify(Object.assign(Object.assign({}, rest), { id: op }));
    }
  }
  stratify2.id = id;
  function parentData(data) {
    if (data === void 0) {
      return operators.parentData;
    } else {
      const { parentIds: _, parentData: __ } = operators, rest = __rest(operators, ["parentIds", "parentData"]);
      return buildStratify(Object.assign(Object.assign({}, rest), { parentIds: wrapParentData(data), parentData: data }));
    }
  }
  stratify2.parentData = parentData;
  function parentIds(ids) {
    if (ids === void 0) {
      return operators.parentIds;
    } else {
      const { parentIds: _, parentData: __ } = operators, rest = __rest(operators, ["parentIds", "parentData"]);
      return buildStratify(Object.assign(Object.assign({}, rest), { parentIds: ids, parentData: wrapParentIds(ids) }));
    }
  }
  stratify2.parentIds = parentIds;
  return stratify2;
}
function wrapParentIds(parentIds) {
  function wrapper(d, i) {
    return (parentIds(d, i) || []).map((id) => [id, void 0]);
  }
  wrapper.wrapped = parentIds;
  return wrapper;
}
function wrapParentData(parentData) {
  function wrapper(d, i) {
    return (parentData(d, i) || []).map(([id]) => id);
  }
  wrapper.wrapped = parentData;
  return wrapper;
}
function hasId(d) {
  try {
    return typeof d.id === "string";
  } catch (_a) {
    return false;
  }
}
function defaultId(data) {
  if (hasId(data)) {
    return data.id;
  } else {
    throw new Error(js`default id function expected datum to have an id field but got '${data}'`);
  }
}
function hasParentIds(d) {
  try {
    const parentIds = d.parentIds;
    return parentIds === void 0 || parentIds instanceof Array && parentIds.every((id) => typeof id === "string");
  } catch (_a) {
    return false;
  }
}
function defaultParentIds(d) {
  if (hasParentIds(d)) {
    return d.parentIds;
  } else {
    throw new Error(`default parentIds function expected datum to have a parentIds field but got: ${d}`);
  }
}
function stratify(...args) {
  if (args.length) {
    throw new Error(`got arguments to stratify(${args}), but constructor takes no aruguments. These were probably meant as data which should be called as stratify()(...)`);
  } else {
    return buildStratify({
      id: defaultId,
      parentIds: defaultParentIds,
      parentData: wrapParentIds(defaultParentIds)
    });
  }
}

// dist/sugiyama/utils.js
function vlayer(node) {
  if (node.value === void 0) {
    throw new Error(js`node with data '${node.data}' did not get a defined value during layering`);
  } else if (node.value < 0) {
    throw new Error(js`node with data '${node.data}' got an invalid (negative) value during layering: ${node.value}`);
  } else {
    return node.value;
  }
}
function sugify(dag) {
  const cache = new Map(dag.idescendants().map((node) => [node, { node, layer: vlayer(node) }]));
  function augment(data) {
    const layer = data.layer + 1;
    const targets = "node" in data ? data.node.children() : [data.target];
    const source = "node" in data ? data.node : data.source;
    return targets.map((target) => {
      const datum = def(cache.get(target));
      if (datum.layer < layer) {
        throw new Error(js`layering left child data '${target.data}' (${target.value}) with greater or equal layer to parent data '${source.data}' (${source.value})`);
      }
      return datum.layer === layer ? datum : { source, target, layer };
    });
  }
  const sugi = hierarchy().children(augment)(...dag.iroots().map((node) => def(cache.get(node))));
  const layers = [];
  for (const node of sugi) {
    const layer = layers[node.data.layer] || (layers[node.data.layer] = []);
    layer.push(node);
  }
  if (!layers[0] || !layers[0].length) {
    throw new Error("no nodes were assigned to layer 0");
  }
  for (const layer of layers) {
    assert(layer && layer.length);
  }
  return layers;
}

// dist/sugiyama/coord/utils.js
var import_quadprog = __toModule(require_quadprog2());
function qp(Q, c, A, b, meq) {
  if (!c.length) {
    return [];
  }
  const Dmat = [[0]];
  const dvec = [0];
  const Amat = [[0]];
  const bvec = [0];
  for (const qRow of Q) {
    const newRow = [0];
    newRow.push(...qRow);
    Dmat.push(newRow);
  }
  dvec.push(...c);
  Amat.push(...c.map(() => [0]));
  for (const aRow of A) {
    for (const [j, val] of aRow.entries()) {
      Amat[j + 1].push(-val);
    }
  }
  bvec.push(...b.map((v) => -v));
  const { solution, message } = (0, import_quadprog.solveQP)(Dmat, dvec, Amat, bvec, meq);
  assert(!message.length);
  solution.shift();
  return solution;
}
function solve(Q, c, A, b, meq = 0) {
  c.pop();
  Q.pop();
  Q.forEach((row) => row.pop());
  A.forEach((row) => row.pop());
  const solution = qp(Q, c, A, b, meq);
  solution.push(0);
  return solution;
}
function indices(layers) {
  return new Map(layers.flatMap((layer) => layer).map((n, i) => [n, i]));
}
function init(layers, inds, nodeSize) {
  const n = 1 + Math.max(...inds.values());
  const A = [];
  const b = [];
  for (const layer of layers) {
    for (const [first, second] of bigrams(layer)) {
      const find = def(inds.get(first));
      const sind = def(inds.get(second));
      const cons = new Array(n).fill(0);
      cons[find] = 1;
      cons[sind] = -1;
      A.push(cons);
      b.push(-(nodeSize(first) + nodeSize(second)) / 2);
    }
  }
  const c = new Array(n).fill(0);
  const Q = [...new Array(n)].map(() => new Array(n).fill(0));
  return [Q, c, A, b];
}
function minDist(Q, pind, cind, coef) {
  Q[cind][cind] += coef;
  Q[cind][pind] -= coef;
  Q[pind][cind] -= coef;
  Q[pind][pind] += coef;
}
function minBend(Q, pind, nind, cind, coef) {
  Q[cind][cind] += coef;
  Q[cind][nind] -= 2 * coef;
  Q[cind][pind] += coef;
  Q[nind][cind] -= 2 * coef;
  Q[nind][nind] += 4 * coef;
  Q[nind][pind] -= 2 * coef;
  Q[pind][cind] += coef;
  Q[pind][nind] -= 2 * coef;
  Q[pind][pind] += coef;
}
function layout(layers, nodeSize, inds, solution) {
  let start = Number.POSITIVE_INFINITY;
  let finish = Number.NEGATIVE_INFINITY;
  for (const layer of layers) {
    const first = layer[0];
    const last = layer[layer.length - 1];
    start = Math.min(start, solution[def(inds.get(first))] - nodeSize(first) / 2);
    finish = Math.max(finish, solution[def(inds.get(last))] + nodeSize(last) / 2);
  }
  for (const layer of layers) {
    for (const node of layer) {
      node.x = solution[def(inds.get(node))] - start;
    }
  }
  return finish - start;
}

// dist/sugiyama/coord/quad.js
function componentMap(layers) {
  const parents = new Map();
  for (const layer of layers) {
    for (const node of layer) {
      for (const child of node.ichildren()) {
        const pars = parents.get(child);
        if (pars) {
          pars.push(node);
        } else {
          parents.set(child, [node]);
        }
      }
    }
  }
  function* graph(node) {
    yield* node.ichildren();
    yield* parents.get(node) || [];
  }
  let component = 0;
  const compMap = new Map();
  for (const layer of layers) {
    for (const node of layer) {
      if (compMap.has(node))
        continue;
      for (const comp of dfs(graph, node)) {
        compMap.set(comp, component);
      }
      component++;
    }
  }
  return compMap;
}
function splitComponentLayers(layers, compMap) {
  const split = [];
  let newLayers = [];
  let lastComponents = new Set();
  for (const layer of layers) {
    const currentComponents = new Set(layer.map((n) => def(compMap.get(n))));
    if (!setIntersect(lastComponents, currentComponents)) {
      split.push(newLayers = []);
    }
    newLayers.push(layer);
    lastComponents = currentComponents;
  }
  return split;
}
function buildOperator(options) {
  function quadComponent(layers, nodeSize, compMap) {
    const { vertNode, vertDummy, curveNode, curveDummy, comp } = options;
    const inds = indices(layers);
    const [Q, c, A, b] = init(layers, inds, nodeSize);
    for (const layer of layers) {
      for (const par of layer) {
        const pind = def(inds.get(par));
        const wpdist = "node" in par.data ? vertNode : vertDummy;
        for (const node of par.ichildren()) {
          const nind = def(inds.get(node));
          const wndist = "node" in node.data ? vertNode : vertDummy;
          const wcurve = "node" in node.data ? curveNode : curveDummy;
          minDist(Q, pind, nind, wpdist + wndist);
          for (const child of node.ichildren()) {
            const cind = def(inds.get(child));
            minBend(Q, pind, nind, cind, wcurve);
          }
        }
      }
    }
    for (const layer of layers) {
      for (const [first, second] of bigrams(layer)) {
        if (def(compMap.get(first)) !== def(compMap.get(second))) {
          minDist(Q, def(inds.get(first)), def(inds.get(second)), comp);
        }
      }
    }
    const solution = solve(Q, c, A, b);
    return layout(layers, nodeSize, inds, solution);
  }
  function quadCall(layers, nodeSize) {
    const { vertNode, vertDummy, curveNode, curveDummy } = options;
    if (vertNode === 0 && curveNode === 0) {
      throw new Error("node vertical weight or node curve weight needs to be positive");
    } else if (vertDummy === 0 && curveDummy === 0) {
      throw new Error("dummy vertical weight or dummy curve weight needs to be positive");
    }
    const compMap = componentMap(layers);
    const components = splitComponentLayers(layers, compMap);
    const widths = components.map((compon) => quadComponent(compon, nodeSize, compMap));
    const maxWidth = Math.max(...widths);
    if (maxWidth <= 0) {
      throw new Error("must assign nonzero width to at least one node");
    }
    for (const [i, compon] of components.entries()) {
      const offset = (maxWidth - widths[i]) / 2;
      for (const layer of compon) {
        for (const node of layer) {
          node.x = def(node.x) + offset;
        }
      }
    }
    return maxWidth;
  }
  function vertical(val) {
    if (val === void 0) {
      const { vertNode: vertNode2, vertDummy: vertDummy2 } = options;
      return [vertNode2, vertDummy2];
    }
    const [vertNode, vertDummy] = val;
    if (vertNode < 0 || vertDummy < 0) {
      throw new Error(`weights must be non-negative, but were ${vertNode} and ${vertDummy}`);
    } else {
      return buildOperator(Object.assign(Object.assign({}, options), { vertNode, vertDummy }));
    }
  }
  quadCall.vertical = vertical;
  function curve(val) {
    if (val === void 0) {
      const { curveNode: curveNode2, curveDummy: curveDummy2 } = options;
      return [curveNode2, curveDummy2];
    }
    const [curveNode, curveDummy] = val;
    if (curveNode < 0 || curveDummy < 0) {
      throw new Error(`weights must be non-negative, but were ${curveNode} and ${curveDummy}`);
    } else {
      return buildOperator(Object.assign(Object.assign({}, options), { curveNode, curveDummy }));
    }
  }
  quadCall.curve = curve;
  function component(val) {
    if (val === void 0) {
      return options.comp;
    } else if (val <= 0) {
      throw new Error(`weight must be positive, but was ${val}`);
    } else {
      return buildOperator(Object.assign(Object.assign({}, options), { comp: val }));
    }
  }
  quadCall.component = component;
  return quadCall;
}
function quad(...args) {
  if (args.length) {
    throw new Error(`got arguments to quad(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator({
    vertNode: 1,
    vertDummy: 0,
    curveNode: 0,
    curveDummy: 1,
    comp: 1
  });
}

// dist/sugiyama/layering/simplex.js
var import_javascript_lp_solver = __toModule(require_main3());
var __rest2 = undefined && undefined.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function buildOperator2(options) {
  function simplexCall(dag) {
    const variables = {};
    const ints = {};
    const constraints = {};
    const ids = new Map(dag.idescendants().entries().map(([i, node]) => [node, i.toString()]));
    function n(node) {
      return def(ids.get(node));
    }
    function variable(node) {
      return variables[n(node)];
    }
    function before(prefix, first, second, strict = true) {
      const fvar = variable(first);
      const svar = variable(second);
      const cons = `${prefix}: ${def(n(first))} -> ${def(n(second))}`;
      constraints[cons] = { min: +strict };
      fvar[cons] = -1;
      svar[cons] = 1;
    }
    function equal(prefix, first, second) {
      before(`${prefix} before`, first, second, false);
      before(`${prefix} after`, second, first, false);
    }
    const ranks = [];
    const groups = new Map();
    for (const node of dag) {
      const nid = n(node);
      ints[nid] = 1;
      variables[nid] = {
        opt: node.children.length
      };
      const rank2 = options.rank(node);
      if (rank2 !== void 0) {
        ranks.push([rank2, node]);
      }
      const group2 = options.group(node);
      if (group2 !== void 0) {
        const existing = groups.get(group2);
        if (existing) {
          existing.push(node);
        } else {
          groups.set(group2, [node]);
        }
      }
    }
    for (const link of dag.ilinks()) {
      before("link", link.source, link.target);
      ++variable(link.source).opt;
      --variable(link.target).opt;
    }
    const ranked = ranks.sort(([a], [b]) => a - b);
    for (const [[frank, fnode], [srank, snode]] of bigrams(ranked)) {
      if (frank < srank) {
        before("rank", fnode, snode);
      } else {
        equal("rank", fnode, snode);
      }
    }
    for (const group2 of groups.values()) {
      for (const [first, second] of bigrams(group2)) {
        equal("group", first, second);
      }
    }
    const _a = import_javascript_lp_solver.Solve.call({}, {
      optimize: "opt",
      opType: "max",
      constraints,
      variables,
      ints
    }), { feasible } = _a, assignment = __rest2(_a, ["feasible"]);
    if (!feasible) {
      assert(ranks.length || groups.size);
      throw new Error("could not find a feasbile simplex layout, check that rank or group accessors are not ill-defined");
    }
    for (const node of dag) {
      node.value = assignment[n(node)] || 0;
    }
  }
  function rank(newRank) {
    if (newRank === void 0) {
      return options.rank;
    } else {
      const { rank: _ } = options, rest = __rest2(options, ["rank"]);
      return buildOperator2(Object.assign(Object.assign({}, rest), { rank: newRank }));
    }
  }
  simplexCall.rank = rank;
  function group(newGroup) {
    if (newGroup === void 0) {
      return options.group;
    } else {
      const { group: _ } = options, rest = __rest2(options, ["group"]);
      return buildOperator2(Object.assign(Object.assign({}, rest), { group: newGroup }));
    }
  }
  simplexCall.group = group;
  return simplexCall;
}
function defaultAccessor() {
  return void 0;
}
function simplex(...args) {
  if (args.length) {
    throw new Error(`got arguments to simplex(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator2({ rank: defaultAccessor, group: defaultAccessor });
}

// node_modules/d3-array/src/ascending.js
function ascending_default(a, b) {
  return a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/d3-array/src/number.js
function* numbers(values, valueof) {
  if (valueof === void 0) {
    for (let value of values) {
      if (value != null && (value = +value) >= value) {
        yield value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (value = +value) >= value) {
        yield value;
      }
    }
  }
}

// node_modules/d3-array/src/max.js
function max(values, valueof) {
  let max2;
  if (valueof === void 0) {
    for (const value of values) {
      if (value != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (max2 < value || max2 === void 0 && value >= value)) {
        max2 = value;
      }
    }
  }
  return max2;
}

// node_modules/d3-array/src/min.js
function min(values, valueof) {
  let min2;
  if (valueof === void 0) {
    for (const value of values) {
      if (value != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null && (min2 > value || min2 === void 0 && value >= value)) {
        min2 = value;
      }
    }
  }
  return min2;
}

// node_modules/d3-array/src/quickselect.js
function quickselect(array, k, left = 0, right = array.length - 1, compare = ascending_default) {
  while (right > left) {
    if (right - left > 600) {
      const n = right - left + 1;
      const m = k - left + 1;
      const z = Math.log(n);
      const s = 0.5 * Math.exp(2 * z / 3);
      const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
      const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
      const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
      quickselect(array, k, newLeft, newRight, compare);
    }
    const t = array[k];
    let i = left;
    let j = right;
    swap(array, left, k);
    if (compare(array[right], t) > 0)
      swap(array, left, right);
    while (i < j) {
      swap(array, i, j), ++i, --j;
      while (compare(array[i], t) < 0)
        ++i;
      while (compare(array[j], t) > 0)
        --j;
    }
    if (compare(array[left], t) === 0)
      swap(array, left, j);
    else
      ++j, swap(array, j, right);
    if (j <= k)
      left = j + 1;
    if (k <= j)
      right = j - 1;
  }
  return array;
}
function swap(array, i, j) {
  const t = array[i];
  array[i] = array[j];
  array[j] = t;
}

// node_modules/d3-array/src/quantile.js
function quantile(values, p, valueof) {
  values = Float64Array.from(numbers(values, valueof));
  if (!(n = values.length))
    return;
  if ((p = +p) <= 0 || n < 2)
    return min(values);
  if (p >= 1)
    return max(values);
  var n, i = (n - 1) * p, i0 = Math.floor(i), value0 = max(quickselect(values, i0).subarray(0, i0 + 1)), value1 = min(values.subarray(i0 + 1));
  return value0 + (value1 - value0) * (i - i0);
}

// node_modules/d3-array/src/median.js
function median_default(values, valueof) {
  return quantile(values, 0.5, valueof);
}

// dist/sugiyama/twolayer/agg.js
var Mean = class {
  constructor() {
    this.mean = 0;
    this.count = 0;
  }
  add(val) {
    this.mean += (val - this.mean) / ++this.count;
  }
  val() {
    return this.count ? this.mean : void 0;
  }
};
var meanFactory = () => new Mean();
var Median = class {
  constructor() {
    this.vals = [];
  }
  add(val) {
    this.vals.push(val);
  }
  val() {
    return median_default(this.vals);
  }
};
var medianFactory = () => new Median();
function aggregate(aggregator, iter) {
  const agg2 = aggregator();
  for (const val of iter) {
    agg2.add(val);
  }
  return agg2.val();
}
function order(layer, poses) {
  const orderMap = new Map();
  for (const node of layer) {
    const val = poses.get(node);
    if (val === void 0) {
      continue;
    }
    const nodes = orderMap.get(val);
    if (nodes === void 0) {
      orderMap.set(val, [node]);
    } else {
      nodes.push(node);
    }
  }
  const ordered = [...orderMap.entries()].sort(([a], [b]) => a - b).flatMap(([, nodes]) => nodes);
  const inds = new Map(layer.map((n, i) => [n, i]));
  const unassigned = layer.filter((n) => poses.get(n) === void 0);
  const placements = new Array(unassigned.length).fill(null);
  function recurse(ustart, uend, ostart, oend) {
    if (uend <= ustart)
      return;
    const umid = Math.floor((ustart + uend) / 2);
    const node = unassigned[umid];
    const nind = def(inds.get(node));
    let last = 0;
    const inversions = [last];
    for (let i = ostart; i < oend; ++i) {
      last += def(inds.get(ordered[i])) < nind ? -1 : 1;
      inversions.push(last);
    }
    const placement = ostart + inversions.indexOf(Math.min(...inversions));
    placements[umid] = placement;
    recurse(ustart, umid, ostart, placement);
    recurse(umid + 1, uend, placement, oend);
  }
  recurse(0, unassigned.length, 0, ordered.length);
  placements.push(ordered.length + 1);
  let insert = 0;
  let uind = 0;
  for (const [i, node] of ordered.entries()) {
    while (placements[uind] == i) {
      layer[insert++] = unassigned[uind++];
    }
    layer[insert++] = node;
  }
  while (placements[uind] == ordered.length) {
    layer[insert++] = unassigned[uind++];
  }
}
function buildOperator3({ factory }) {
  function aggCall(topLayer, bottomLayer, topDown) {
    if (topDown) {
      const incr = new Map(bottomLayer.map((node) => [node, factory()]));
      for (const [i, node] of topLayer.entries()) {
        for (const child of node.ichildren()) {
          def(incr.get(child)).add(i);
        }
      }
      const aggs = new Map([...incr.entries()].map(([node, agg2]) => [node, agg2.val()]));
      order(bottomLayer, aggs);
    } else {
      const inds = new Map(bottomLayer.map((node, i) => [node, i]));
      const aggs = new Map(topLayer.map((node) => {
        const agg2 = aggregate(factory, node.ichildren().map((child) => def(inds.get(child))));
        return [node, agg2];
      }));
      order(topLayer, aggs);
    }
  }
  function aggregator(val) {
    if (val === void 0) {
      return factory;
    } else {
      return buildOperator3({ factory: val });
    }
  }
  aggCall.aggregator = aggregator;
  return aggCall;
}
function agg(...args) {
  if (args.length) {
    throw new Error(`got arguments to agg(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator3({ factory: medianFactory });
}

// dist/sugiyama/decross/two-layer.js
var __rest3 = undefined && undefined.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function buildOperator4(options) {
  function twoLayerCall(layers) {
    const reversed = layers.slice().reverse();
    let changed = true;
    for (let i = 0; i < options.passes && changed; ++i) {
      changed = false;
      for (const [upper, bottom] of bigrams(layers)) {
        const init2 = new Map(bottom.map((node, i2) => [node, i2]));
        options.order(upper, bottom, true);
        if (bottom.some((node, i2) => def(init2.get(node)) !== i2)) {
          changed = true;
        }
      }
      for (const [lower, topl] of bigrams(reversed)) {
        const init2 = new Map(topl.map((node, i2) => [node, i2]));
        options.order(topl, lower, false);
        if (topl.some((node, i2) => def(init2.get(node)) !== i2)) {
          changed = true;
        }
      }
    }
  }
  function order2(ord) {
    if (ord === void 0) {
      return options.order;
    } else {
      const { order: _ } = options, rest = __rest3(options, ["order"]);
      return buildOperator4(Object.assign(Object.assign({}, rest), { order: ord }));
    }
  }
  twoLayerCall.order = order2;
  function passes(val) {
    if (val === void 0) {
      return options.passes;
    } else if (val <= 0) {
      throw new Error("number of passes must be positive");
    } else {
      return buildOperator4(Object.assign(Object.assign({}, options), { passes: val }));
    }
  }
  twoLayerCall.passes = passes;
  return twoLayerCall;
}
function twoLayer(...args) {
  if (args.length) {
    throw new Error(`got arguments to twoLayer(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator4({ order: agg(), passes: 1 });
}

// dist/sugiyama/index.js
var __rest4 = undefined && undefined.__rest || function(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
};
function wrapNodeSizeAccessor(acc) {
  const empty = acc();
  function sugiNodeSizeAccessor(node) {
    return "node" in node.data ? acc(node.data.node) : empty;
  }
  sugiNodeSizeAccessor.wrapped = acc;
  return sugiNodeSizeAccessor;
}
function cachedNodeSize(nodeSize) {
  const cache = new Map();
  function cached(node) {
    let val = cache.get(node);
    if (val === void 0) {
      val = nodeSize(node);
      const [width, height] = val;
      if (width < 0 || height < 0) {
        throw new Error(js`all node sizes must be non-negative, but got width ${width} and height ${height} for node '${node}'`);
      }
      cache.set(node, val);
    }
    return val;
  }
  const cachedX = (node) => cached(node)[0];
  const cachedY = (node) => cached(node)[1];
  return [cachedX, cachedY];
}
function buildOperator5(options) {
  function sugiyama2(dag) {
    options.layering(dag);
    const layers = sugify(dag);
    const [xSize, ySize] = cachedNodeSize(options.sugiNodeSize);
    let height = 0;
    for (const layer of layers) {
      const layerHeight = Math.max(...layer.map(ySize));
      for (const node of layer) {
        node.y = height + layerHeight / 2;
      }
      height += layerHeight;
    }
    if (height <= 0) {
      throw new Error("at least one node must have positive height, but total height was zero");
    }
    options.decross(layers);
    let width = options.coord(layers, xSize);
    for (const layer of layers) {
      for (const node of layer) {
        if (node.x === void 0) {
          throw new Error(js`coord didn't assign an x to node '${node}'`);
        } else if (node.x < 0 || node.x > width) {
          throw new Error(`coord assgined an x (${node.x}) outside of [0, ${width}]`);
        }
      }
    }
    if (options.size !== null) {
      const [newWidth, newHeight] = options.size;
      for (const layer of layers) {
        for (const node of layer) {
          assert(node.x !== void 0 && node.y !== void 0);
          node.x *= newWidth / width;
          node.y *= newHeight / height;
        }
      }
      width = newWidth;
      height = newHeight;
    }
    for (const layer of layers) {
      for (const sugi of layer) {
        assert(sugi.x !== void 0 && sugi.y !== void 0);
        if ("target" in sugi.data)
          continue;
        sugi.data.node.x = sugi.x;
        sugi.data.node.y = sugi.y;
        const pointsMap = new Map(sugi.data.node.ichildLinks().map(({ points, target }) => [target, points]));
        for (let child of sugi.ichildren()) {
          const points = [{ x: sugi.x, y: sugi.y }];
          while ("target" in child.data) {
            assert(child.x !== void 0 && child.y !== void 0);
            points.push({ x: child.x, y: child.y });
            [child] = child.ichildren();
          }
          assert(child.x !== void 0 && child.y !== void 0);
          points.push({ x: child.x, y: child.y });
          const assign = def(pointsMap.get(child.data.node));
          assign.splice(0, assign.length, ...points);
        }
      }
    }
    return { width, height };
  }
  function layering(layer) {
    if (layer === void 0) {
      return options.layering;
    } else {
      const { layering: _ } = options, rest = __rest4(options, ["layering"]);
      return buildOperator5(Object.assign(Object.assign({}, rest), { layering: layer }));
    }
  }
  sugiyama2.layering = layering;
  function decross(dec) {
    if (dec === void 0) {
      return options.decross;
    } else {
      const { decross: _ } = options, rest = __rest4(options, ["decross"]);
      return buildOperator5(Object.assign(Object.assign({}, rest), { decross: dec }));
    }
  }
  sugiyama2.decross = decross;
  function coord(crd) {
    if (crd === void 0) {
      return options.coord;
    } else {
      const { coord: _ } = options, rest = __rest4(options, ["coord"]);
      return buildOperator5(Object.assign(Object.assign({}, rest), { coord: crd }));
    }
  }
  sugiyama2.coord = coord;
  function size(sz) {
    if (sz !== void 0) {
      return buildOperator5(Object.assign(Object.assign({}, options), { size: sz }));
    } else {
      return options.size;
    }
  }
  sugiyama2.size = size;
  function nodeSize(sz) {
    if (sz !== void 0) {
      const { nodeSize: _, sugiNodeSize: __ } = options, rest = __rest4(options, ["nodeSize", "sugiNodeSize"]);
      return buildOperator5(Object.assign(Object.assign({}, rest), { nodeSize: sz, sugiNodeSize: wrapNodeSizeAccessor(sz) }));
    } else {
      return options.nodeSize;
    }
  }
  sugiyama2.nodeSize = nodeSize;
  function sugiNodeSize(sz) {
    if (sz !== void 0) {
      const { sugiNodeSize: _, nodeSize: __ } = options, rest = __rest4(options, ["sugiNodeSize", "nodeSize"]);
      return buildOperator5(Object.assign(Object.assign({}, rest), { sugiNodeSize: sz, nodeSize: null }));
    } else {
      return options.sugiNodeSize;
    }
  }
  sugiyama2.sugiNodeSize = sugiNodeSize;
  return sugiyama2;
}
function defaultNodeSize(node) {
  return [+(node !== void 0), 1];
}
function sugiyama(...args) {
  if (args.length) {
    throw new Error(`got arguments to sugiyama(${args}), but constructor takes no aruguments.`);
  } else {
    return buildOperator5({
      layering: simplex(),
      decross: twoLayer(),
      coord: quad(),
      size: null,
      nodeSize: defaultNodeSize,
      sugiNodeSize: wrapNodeSizeAccessor(defaultNodeSize)
    });
  }
}

// dist/sugiyama/layering/topological.js
function topological(...args) {
  if (args.length) {
    throw new Error(`got arguments to topological(${args}), but constructor takes no aruguments.`);
  }
  function topologicalCall(dag) {
    for (const [layer, node] of dag.idescendants("before").entries()) {
      node.value = layer;
    }
  }
  return topologicalCall;
}

// dist/sugiyama/layering/longest-path.js
function buildOperator6(options) {
  function longestPathCall(dag) {
    if (options.topDown) {
      dag.depth();
    } else {
      dag.height();
      const maxHeight = Math.max(...dag.iroots().map((d) => def(d.value)));
      for (const node of dag) {
        node.value = maxHeight - def(node.value);
      }
    }
  }
  function topDown(val) {
    if (val === void 0) {
      return options.topDown;
    } else {
      return buildOperator6(Object.assign(Object.assign({}, options), { topDown: val }));
    }
  }
  longestPathCall.topDown = topDown;
  return longestPathCall;
}
function longestPath(...args) {
  if (args.length) {
    throw new Error(`got arguments to longestPath(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator6({ topDown: true });
}

// dist/sugiyama/layering/coffman-graham.js
var import_fastpriorityqueue = __toModule(require_FastPriorityQueue());
function buildOperator7(options) {
  function coffmanGrahamCall(dag) {
    const maxWidth = options.width || Math.floor(Math.sqrt(dag.size() + 0.5));
    const data = new Map(dag.idescendants().map((node2) => [
      node2,
      { before: [], parents: [] }
    ]));
    for (const node2 of dag) {
      for (const child of node2.ichildren()) {
        def(data.get(child)).parents.push(node2);
      }
    }
    function comp(left, right) {
      const leftBefore = def(data.get(left)).before;
      const rightBefore = def(data.get(right)).before;
      for (const [i2, leftb] of leftBefore.entries()) {
        const rightb = rightBefore[i2];
        if (rightb === void 0) {
          return false;
        } else if (leftb < rightb) {
          return true;
        } else if (rightb < leftb) {
          return false;
        }
      }
      return true;
    }
    const queue = new import_fastpriorityqueue.default(comp);
    for (const root of dag.iroots()) {
      queue.add(root);
    }
    let i = 0;
    let layer = 0;
    let width2 = 0;
    let node;
    while (node = queue.poll()) {
      if (width2 < maxWidth && def(data.get(node)).parents.every((p) => def(p.value) < layer)) {
        node.value = layer;
        width2++;
      } else {
        node.value = ++layer;
        width2 = 1;
      }
      for (const child of node.ichildren()) {
        const { before, parents } = def(data.get(child));
        before.push(i);
        if (before.length === parents.length) {
          before.sort((a, b) => b - a);
          queue.add(child);
        }
      }
      i++;
    }
  }
  function width(maxWidth) {
    if (maxWidth === void 0) {
      return options.width;
    } else if (maxWidth < 0) {
      throw new Error(`width must be non-negative: ${maxWidth}`);
    } else {
      return buildOperator7(Object.assign(Object.assign({}, options), { width: maxWidth }));
    }
  }
  coffmanGrahamCall.width = width;
  return coffmanGrahamCall;
}
function coffmanGraham(...args) {
  if (args.length) {
    throw new Error(`got arguments to coffmanGraham(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator7({ width: 0 });
}

// dist/sugiyama/decross/opt.js
var import_javascript_lp_solver2 = __toModule(require_main3());
function buildOperator8(options) {
  function optCall(layers) {
    const numVars = layers.reduce((t, l) => t + l.length * Math.max(l.length - 1, 0) / 2, 0);
    const numEdges = layers.reduce((t, l) => t + l.reduce((s, n) => s + n.ichildren().length, 0), 0);
    if (options.large !== "large" && numVars > 1200) {
      throw new Error(`size of dag to decrossOpt is too large and will likely crash instead of complete, enable "large" grahps to run anyway`);
    } else if (options.large !== "large" && options.large !== "medium" && (numVars > 400 || numEdges > 100)) {
      throw new Error(`size of dag to decrossOpt is too large and will likely not complete, enable "medium" grahps to run anyway`);
    }
    const distanceConstraints = [];
    for (const [topLayer, bottomLayer] of bigrams(layers)) {
      const withParents = new Set(topLayer.flatMap((node) => node.children()));
      const topUnconstrained = bottomLayer.filter((node) => !withParents.has(node));
      const topGroups = topLayer.map((node) => node.children()).filter((cs) => cs.length > 1);
      distanceConstraints.push([topUnconstrained, topGroups]);
      const bottomUnconstrained = topLayer.filter((n) => !n.ichildren().length);
      const parents = new Map();
      for (const node of topLayer) {
        for (const child of node.ichildren()) {
          const group = parents.get(child);
          if (group) {
            group.push(node);
          } else {
            parents.set(child, [node]);
          }
        }
      }
      const bottomGroups = [...parents.values()];
      distanceConstraints.push([bottomUnconstrained, bottomGroups]);
    }
    const maxDistCost = distanceConstraints.reduce((cost, [unc, gs]) => gs.reduce((t, cs) => t + cs.length * cs.length, 0) * unc.length, 0) / 4;
    const distWeight = 1 / (maxDistCost + 1);
    const preserveWeight = distWeight / (numVars + 1);
    const model = {
      optimize: "opt",
      opType: "min",
      constraints: {},
      variables: {},
      ints: {}
    };
    const inds = new Map();
    {
      let i = 0;
      for (const layer of layers) {
        for (const node of layer) {
          inds.set(node, i++);
        }
      }
    }
    function key(...nodes) {
      return nodes.map((n) => def(inds.get(n))).sort((a, b) => a - b).join(" => ");
    }
    function perms(layer) {
      for (const [i, n1] of layer.slice(0, layer.length - 1).entries()) {
        for (const n2 of layer.slice(i + 1)) {
          const pair = key(n1, n2);
          model.ints[pair] = 1;
          model.constraints[pair] = {
            max: 1
          };
          model.variables[pair] = {
            opt: -preserveWeight,
            [pair]: 1
          };
        }
      }
      for (const [i, n1] of layer.slice(0, layer.length - 1).entries()) {
        for (const [j, n2] of layer.slice(i + 1).entries()) {
          for (const n3 of layer.slice(i + j + 2)) {
            const pair1 = key(n1, n2);
            const pair2 = key(n1, n3);
            const pair3 = key(n2, n3);
            const triangle = key(n1, n2, n3);
            const triangleUp = triangle + "+";
            model.constraints[triangleUp] = {
              max: 1
            };
            model.variables[pair1][triangleUp] = 1;
            model.variables[pair2][triangleUp] = -1;
            model.variables[pair3][triangleUp] = 1;
            const triangleDown = triangle + "-";
            model.constraints[triangleDown] = {
              min: 0
            };
            model.variables[pair1][triangleDown] = 1;
            model.variables[pair2][triangleDown] = -1;
            model.variables[pair3][triangleDown] = 1;
          }
        }
      }
    }
    function cross(layer) {
      for (const [i, p1] of layer.slice(0, layer.length - 1).entries()) {
        for (const p2 of layer.slice(i + 1)) {
          const pairp = key(p1, p2);
          for (const c1 of p1.ichildren()) {
            for (const c2 of p2.ichildren()) {
              if (c1 === c2) {
                continue;
              }
              const pairc = key(c1, c2);
              const slack = `slack (${pairp}) (${pairc})`;
              const slackUp = `${slack} +`;
              const slackDown = `${slack} -`;
              model.variables[slack] = {
                opt: 1,
                [slackUp]: 1,
                [slackDown]: 1
              };
              const sign = Math.sign(def(inds.get(c1)) - def(inds.get(c2)));
              const flip = Math.max(sign, 0);
              model.constraints[slackUp] = {
                min: flip
              };
              model.variables[pairp][slackUp] = 1;
              model.variables[pairc][slackUp] = sign;
              model.constraints[slackDown] = {
                min: -flip
              };
              model.variables[pairp][slackDown] = -1;
              model.variables[pairc][slackDown] = -sign;
            }
          }
        }
      }
    }
    function distance(unconstrained, groups) {
      for (const node of unconstrained) {
        for (const group of groups) {
          for (const [i, start] of group.entries()) {
            for (const end of group.slice(i + 1)) {
              const base = [start, node, end].map((n) => def(inds.get(n))).join(" => ");
              const slack = `dist ${base}`;
              const normal = `${slack} normal`;
              const reversed = `${slack} reversed`;
              model.variables[slack] = {
                opt: distWeight,
                [normal]: 1,
                [reversed]: 1
              };
              let pos = 0;
              for (const [n1, n2] of [
                [start, node],
                [start, end],
                [node, end]
              ]) {
                const pair = key(n1, n2);
                const sign = Math.sign(def(inds.get(n1)) - def(inds.get(n2)));
                pos += +(sign > 0);
                model.variables[pair][normal] = -sign;
                model.variables[pair][reversed] = sign;
              }
              model.constraints[normal] = {
                min: 1 - pos
              };
              model.constraints[reversed] = {
                min: pos - 2
              };
            }
          }
        }
      }
    }
    for (const layer of layers) {
      perms(layer);
    }
    for (const layer of layers.slice(0, layers.length - 1)) {
      cross(layer);
    }
    if (options.dist) {
      for (const [unconstrained, groups] of distanceConstraints) {
        distance(unconstrained, groups);
      }
    }
    const ordering = import_javascript_lp_solver2.Solve.call({}, model);
    for (const layer of layers) {
      layer.sort((n1, n2) => ordering[key(n1, n2)] || -1);
    }
  }
  function large(val) {
    if (val === void 0) {
      return options.large;
    } else {
      return buildOperator8(Object.assign(Object.assign({}, options), { large: val }));
    }
  }
  optCall.large = large;
  function dist(val) {
    if (val === void 0) {
      return options.dist;
    } else {
      return buildOperator8(Object.assign(Object.assign({}, options), { dist: val }));
    }
  }
  optCall.dist = dist;
  return optCall;
}
function opt(...args) {
  if (args.length) {
    throw new Error(`got arguments to opt(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator8({ large: "small", dist: false });
}

// dist/sugiyama/coord/center.js
function center(...args) {
  if (args.length) {
    throw new Error(`got arguments to center(${args}), but constructor takes no aruguments.`);
  }
  function centerCall(layers, nodeSize) {
    const widths = layers.map((layer) => {
      let width = 0;
      for (const node of layer) {
        const nodeWidth = nodeSize(node);
        node.x = width + nodeWidth / 2;
        width += nodeWidth;
      }
      return width;
    });
    const maxWidth = Math.max(...widths);
    if (maxWidth <= 0) {
      throw new Error("must assign nonzero width to at least one node");
    }
    for (const [i, layer] of layers.entries()) {
      const width = widths[i];
      const offset = (maxWidth - width) / 2;
      for (const node of layer) {
        node.x = def(node.x) + offset;
      }
    }
    return maxWidth;
  }
  return centerCall;
}

// dist/sugiyama/coord/greedy.js
function greedy(...args) {
  if (args.length) {
    throw new Error(`got arguments to greedy(${args}), but constructor takes no aruguments.`);
  }
  function greedyCall(layers, nodeSize) {
    const assignment = meanAssignment;
    const degrees = new Map();
    for (const layer of layers) {
      for (const node of layer) {
        degrees.set(node, node.ichildren().length + ("node" in node.data ? 0 : -3));
      }
    }
    for (const layer of layers) {
      for (const node of layer) {
        for (const child of node.ichildren()) {
          degrees.set(child, def(degrees.get(child)) + 1);
        }
      }
    }
    let [lastLayer, ...restLayers] = layers;
    let start = 0;
    let finish = 0;
    for (const node of lastLayer) {
      const size = nodeSize(node);
      node.x = finish + size / 2;
      finish += size;
    }
    for (const layer of restLayers) {
      assignment(lastLayer, layer);
      const ordered = layer.map((node, j) => [j, node]).sort(([aj, anode], [bj, bnode]) => {
        const adeg = def(degrees.get(anode));
        const bdeg = def(degrees.get(bnode));
        return adeg === bdeg ? aj - bj : bdeg - adeg;
      });
      for (const [j, node] of ordered) {
        const nwidth = nodeSize(node);
        let end = def(node.x) + nwidth / 2;
        for (const next of layer.slice(j + 1)) {
          const hsize = nodeSize(next) / 2;
          const nx = next.x = Math.max(def(next.x), end + hsize);
          end = nx + hsize;
        }
        finish = Math.max(finish, end);
        let begin = def(node.x) - nwidth / 2;
        for (const next of layer.slice(0, j).reverse()) {
          const hsize = nodeSize(next) / 2;
          const nx = next.x = Math.min(def(next.x), begin - hsize);
          begin = nx - hsize;
        }
        start = Math.min(start, begin);
      }
      lastLayer = layer;
    }
    for (const layer of layers) {
      for (const node of layer) {
        node.x = def(node.x) - start;
      }
    }
    const width = finish - start;
    if (width <= 0) {
      throw new Error("must assign nonzero width to at least one node");
    }
    return width;
  }
  return greedyCall;
}
function meanAssignment(topLayer, bottomLayer) {
  for (const node of bottomLayer) {
    node.x = 0;
  }
  const counts = new Map();
  for (const node of topLayer) {
    assert(node.x !== void 0);
    for (const child of node.ichildren()) {
      assert(child.x !== void 0);
      const newCount = (counts.get(child) || 0) + 1;
      counts.set(child, newCount);
      child.x += (node.x - child.x) / newCount;
    }
  }
}

// dist/sugiyama/coord/topological.js
function topological2(...args) {
  if (args.length) {
    throw new Error(`got arguments to topological(${args}), but constructor takes no aruguments.`);
  }
  function topologicalCall(layers, nodeSize) {
    for (const layer of layers) {
      const numNodes = layer.reduce((count, node) => count + +("node" in node.data), 0);
      if (numNodes !== 1) {
        throw new Error("topological() only works with a topological layering");
      }
    }
    const inds = new Map();
    let i = 0;
    for (const layer of layers) {
      for (const node of layer) {
        if ("target" in node.data) {
          inds.set(node, i++);
        }
      }
    }
    for (const layer of layers) {
      for (const node of layer) {
        if ("node" in node.data) {
          inds.set(node, i);
        }
      }
    }
    const [Q, c, A, b] = init(layers, inds, nodeSize);
    for (const layer of layers) {
      for (const par of layer) {
        const pind = def(inds.get(par));
        for (const node of par.ichildren()) {
          const nind = def(inds.get(node));
          if ("target" in node.data) {
            for (const child of node.ichildren()) {
              const cind = def(inds.get(child));
              minBend(Q, pind, nind, cind, 1);
            }
          }
        }
      }
    }
    const solution = solve(Q, c, A, b);
    const width = layout(layers, nodeSize, inds, solution);
    if (width <= 0) {
      throw new Error("must assign nonzero width to at least one node");
    }
    return width;
  }
  return topologicalCall;
}

// dist/sugiyama/twolayer/opt.js
var import_javascript_lp_solver3 = __toModule(require_main3());
function buildOperator9(options) {
  function optCall(topLayer, bottomLayer, topDown) {
    const reordered = topDown ? bottomLayer : topLayer;
    const numVars = reordered.length * Math.max(reordered.length - 1, 0) / 2;
    const numEdges = topLayer.reduce((t, n) => t + n.ichildren().length, 0);
    if (options.large !== "large" && numVars > 1200) {
      throw new Error(`size of dag to twolayerOpt is too large and will likely crash, enable "large" dags to run anyway`);
    } else if (options.large !== "large" && options.large !== "medium" && (numVars > 400 || numEdges > 100)) {
      throw new Error(`size of dag to twolayerOpt is too large and will likely not finish, enable "medium" dags to run anyway`);
    }
    const model = {
      optimize: "opt",
      opType: "min",
      constraints: {},
      variables: {},
      ints: {}
    };
    const inds = new Map(reordered.map((node, i) => [node, i]));
    function key(...nodes) {
      return nodes.map((n) => def(inds.get(n))).sort((a, b) => a - b).join(" => ");
    }
    let unconstrained, groups;
    if (topDown) {
      const withParents = new Set(topLayer.flatMap((node) => node.children()));
      unconstrained = bottomLayer.filter((node) => !withParents.has(node));
      groups = topLayer.map((node) => node.children()).filter((cs) => cs.length > 1);
    } else {
      unconstrained = topLayer.filter((n) => !n.ichildren().length);
      const parents = new Map();
      for (const node of topLayer) {
        for (const child of node.ichildren()) {
          const group = parents.get(child);
          if (group) {
            group.push(node);
          } else {
            parents.set(child, [node]);
          }
        }
      }
      groups = [...parents.values()];
    }
    const groupSize = groups.reduce((t, cs) => t + cs.length * cs.length, 0);
    const maxDistCost = groupSize * unconstrained.length / 4;
    const distWeight = 1 / (maxDistCost + 1);
    const preserveWeight = distWeight / (numVars + 1);
    const cinds = new Map(bottomLayer.map((node, i) => [node, i]));
    for (const [i, n1] of reordered.slice(0, reordered.length - 1).entries()) {
      for (const n2 of reordered.slice(i + 1)) {
        const pair = key(n1, n2);
        model.ints[pair] = 1;
        model.constraints[pair] = {
          max: 1
        };
        model.variables[pair] = {
          opt: -preserveWeight,
          [pair]: 1
        };
      }
    }
    for (const [i, n1] of reordered.slice(0, reordered.length - 1).entries()) {
      for (const [j, n2] of reordered.slice(i + 1).entries()) {
        for (const n3 of reordered.slice(i + j + 2)) {
          const pair1 = key(n1, n2);
          const pair2 = key(n1, n3);
          const pair3 = key(n2, n3);
          const triangle = key(n1, n2, n3);
          const triangleUp = triangle + "+";
          model.constraints[triangleUp] = {
            max: 1
          };
          model.variables[pair1][triangleUp] = 1;
          model.variables[pair2][triangleUp] = -1;
          model.variables[pair3][triangleUp] = 1;
          const triangleDown = triangle + "-";
          model.constraints[triangleDown] = {
            min: 0
          };
          model.variables[pair1][triangleDown] = 1;
          model.variables[pair2][triangleDown] = -1;
          model.variables[pair3][triangleDown] = 1;
        }
      }
    }
    for (const [i, p1] of topLayer.slice(0, topLayer.length - 1).entries()) {
      for (const p2 of topLayer.slice(i + 1)) {
        for (const c1 of p1.ichildren()) {
          for (const c2 of p2.ichildren()) {
            if (c1 === c2) {
              continue;
            }
            const pair = topDown ? key(c1, c2) : key(p1, p2);
            model.variables[pair].opt += Math.sign(def(cinds.get(c1)) - def(cinds.get(c2)));
          }
        }
      }
    }
    if (options.dist) {
      for (const node of unconstrained) {
        for (const group of groups) {
          for (const [i, start] of group.entries()) {
            for (const end of group.slice(i + 1)) {
              const base = [start, node, end].map((n) => def(inds.get(n))).join(" => ");
              const slack = `dist ${base}`;
              const normal = `${slack} normal`;
              const reversed = `${slack} reversed`;
              model.variables[slack] = {
                opt: distWeight,
                [normal]: 1,
                [reversed]: 1
              };
              let pos = 0;
              for (const [n1, n2] of [
                [start, node],
                [start, end],
                [node, end]
              ]) {
                const pair = key(n1, n2);
                const sign = Math.sign(def(inds.get(n1)) - def(inds.get(n2)));
                pos += +(sign > 0);
                model.variables[pair][normal] = -sign;
                model.variables[pair][reversed] = sign;
              }
              model.constraints[normal] = {
                min: 1 - pos
              };
              model.constraints[reversed] = {
                min: pos - 2
              };
            }
          }
        }
      }
    }
    const ordering = import_javascript_lp_solver3.Solve.call({}, model);
    reordered.sort((n1, n2) => ordering[key(n1, n2)] || -1);
  }
  function large(val) {
    if (val === void 0) {
      return options.large;
    } else {
      return buildOperator9(Object.assign(Object.assign({}, options), { large: val }));
    }
  }
  optCall.large = large;
  function dist(val) {
    if (val === void 0) {
      return options.dist;
    } else {
      return buildOperator9(Object.assign(Object.assign({}, options), { dist: val }));
    }
  }
  optCall.dist = dist;
  return optCall;
}
function opt2(...args) {
  if (args.length) {
    throw new Error(`got arguments to opt(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator9({ large: "small", dist: false });
}

// dist/zherebko/greedy.js
function firstAvailable(inds, target) {
  const index = inds.findIndex((i) => i <= target);
  if (index >= 0) {
    return index;
  } else {
    return inds.length;
  }
}
function greedy2(nodes) {
  const layers = new Map(nodes.map((n, i) => [n, i]));
  const links = [];
  for (const [nodeLayer, node] of nodes.entries()) {
    for (const child of node.ichildren()) {
      const childLayer = def(layers.get(child));
      if (childLayer > nodeLayer + 1) {
        links.push([node, nodeLayer, child, childLayer]);
      }
    }
  }
  links.sort(([, asrcl, , atgtl], [, bsrcl, , btgtl]) => atgtl === btgtl ? bsrcl - asrcl : atgtl - btgtl);
  const indices2 = new Map();
  const pos = [];
  const neg = [];
  for (const [node, nodeLayer, child, childLayer] of links) {
    let targets = indices2.get(node);
    if (targets === void 0) {
      targets = new Map();
      indices2.set(node, targets);
    }
    const negIndex = firstAvailable(neg, nodeLayer);
    const posIndex = firstAvailable(pos, nodeLayer);
    if (negIndex < posIndex) {
      targets.set(child, -negIndex - 1);
      neg[negIndex] = childLayer - 1;
    } else {
      targets.set(child, posIndex + 1);
      pos[posIndex] = childLayer - 1;
    }
  }
  return indices2;
}

// dist/zherebko/index.js
function buildOperator10(width, height) {
  function zherebkoCall(dag) {
    var _a, _b;
    const ordered = [...dag.idescendants("before")];
    const maxLayer = ordered.length - 1;
    if (maxLayer === 0) {
      const [node] = ordered;
      node.x = width / 2;
      node.y = height / 2;
      return;
    }
    const indices2 = greedy2(ordered);
    let minIndex = -1;
    let maxIndex = 1;
    for (const { source, target } of dag.ilinks()) {
      const index = (_a = indices2.get(source)) === null || _a === void 0 ? void 0 : _a.get(target);
      if (index === void 0)
        continue;
      minIndex = Math.min(minIndex, index);
      maxIndex = Math.max(maxIndex, index);
    }
    const layerSize = height / maxLayer;
    for (const [layer, node] of ordered.entries()) {
      node.x = -minIndex * width / (maxIndex - minIndex);
      node.y = layer * layerSize;
    }
    for (const { source, target, points } of dag.ilinks()) {
      points.length = 0;
      assert(source.x !== void 0 && source.y !== void 0);
      assert(target.x !== void 0 && target.y !== void 0);
      points.push({ x: source.x, y: source.y });
      const index = (_b = indices2.get(source)) === null || _b === void 0 ? void 0 : _b.get(target);
      if (index !== void 0) {
        const x = (index - minIndex) / (maxIndex - minIndex) * width;
        const y1 = source.y + layerSize;
        const y2 = target.y - layerSize;
        if (y2 - y1 > layerSize / 2) {
          points.push({ x, y: y1 }, { x, y: y2 });
        } else {
          points.push({ x, y: y1 });
        }
      }
      points.push({ x: target.x, y: target.y });
    }
  }
  function size(sz) {
    if (sz === void 0) {
      return [width, height];
    } else {
      const [newWidth, newHeight] = sz;
      return buildOperator10(newWidth, newHeight);
    }
  }
  zherebkoCall.size = size;
  return zherebkoCall;
}
function zherebko(...args) {
  if (args.length) {
    throw new Error(`got arguments to zherebko(${args}), but constructor takes no aruguments.`);
  }
  return buildOperator10(1, 1);
}
export {
  meanFactory as aggMeanFactory,
  medianFactory as aggMedianFactory,
  center as coordCenter,
  greedy as coordGreedy,
  quad as coordQuad,
  topological2 as coordTopological,
  connect as dagConnect,
  hierarchy as dagHierarchy,
  stratify as dagStratify,
  opt as decrossOpt,
  twoLayer as decrossTwoLayer,
  coffmanGraham as layeringCoffmanGraham,
  longestPath as layeringLongestPath,
  simplex as layeringSimplex,
  topological as layeringTopological,
  sugiyama,
  agg as twolayerAgg,
  opt2 as twolayerOpt,
  zherebko
};
