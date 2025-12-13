# PerseCraft

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://javascript.com)

A lightweight **web-based toolkit** for **compiler design students** and developers to experiment with **context-free grammar transformations** and **parsing table construction**.

## ✨ **What it does**

PerseCraft provides **three essential compiler grammar operations** in one interactive interface:

| Feature | Purpose | Input Example |
|---------|---------|---------------|
| **Left Recursion Elimination** | Converts left-recursive grammars to LL(1)-compatible form | `E→E+T\|T` |
| **Left Factoring** | Removes common prefixes from grammar alternatives | `A→aB\|aC\|b` |
| **FIRST & FOLLOW Sets** | Computes parsing table prerequisites | `S→AB\|C` |

## 🚀 **Quick Start**

1. **Clone/Download** the repository
2. **Open `index.html`** in any modern web browser
3. **Enter grammar** using the format guide (hover `?` icon)
4. **Click "Craft"** to transform your grammar

**No installation required!** Pure vanilla JavaScript.

## 📝 **Input Format**

# PerseCraft

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://javascript.com)

A lightweight **web-based toolkit** for **compiler design students** and developers to experiment with **context-free grammar transformations** and **parsing table construction**.

## ✨ **What it does**

PerseCraft provides **three essential compiler grammar operations** in one interactive interface:

| Feature | Purpose | Input Example |
|---------|---------|---------------|
| **Left Recursion Elimination** | Converts left-recursive grammars to LL(1)-compatible form | `E→E+T\|T` |
| **Left Factoring** | Removes common prefixes from grammar alternatives | `A→aB\|aC\|b` |
| **FIRST & FOLLOW Sets** | Computes parsing table prerequisites | `S→AB\|C` |

## 🚀 **Quick Start**

1. **Clone/Download** the repository
2. **Open `index.html`** in any modern web browser
3. **Enter grammar** using the format guide (hover `?` icon)
4. **Click "Craft"** to transform your grammar

**No installation required!** Pure vanilla JavaScript.

## 📝 **Input Format**
Enter rules ONE PER LINE. End with empty line or "END"

Left Recursion: NO SPACES → E→E+T|T
Left Factoring & FIRST/FOLLOW: Spaces OK → E → E + T | T

LHS: Single uppercase (A-Z)
Epsilon: eps or ϵ
Terminals: lowercase (a,b,id,+)
Non-terminals: uppercase (A-Z)

text

## 🎯 **Example Usage**

### **Input (Left Recursion)**
E→E+T|T
T→T*F|F
F→(E)|id
END

text

### **Output**
E → T X1
X1 → +T X1 | ϵ
T → F X2
X2 → *F X2 | ϵ
F → (E) | id

text

## 🛠 **File Structure**

PerseCraft/
├── index.html # Main UI
├── about.html # Team & About page
├── styles.css # Core styling
├── about.css # About page styling
├── lr.js # Left Recursion Elimination
├── lf.js # Left Factoring
├── fftable.js # FIRST/FOLLOW computation
├── index.js # Mode switching & controller
└── images/
├── logo.png
└── member1-5.jpg # Team photos

text

## 👥 **Team**

Built by **CSE students** from Bangladesh as an academic project:

| Name | ID | Role |
|------|----|------|
| Md Ashraful Alam Shuvo | 232-15-896 | Project Manager & Designer |
| Md Jubaer Al Mahmud | 232-15-871 | FIRST/FOLLOW Logic |
| Rizone Ahmed Nibir | 232-15-908 | Left Factoring Logic |
| Mahfuzur Rahman | 232-15-903 | Left Recursion Logic |
| Md Abdul Kaiyum | 232-15-915 | Deployment & Operations |

## 🎓 **Academic Context**

This tool implements core algorithms from **Compilers Principles** (Dragon Book):
- **Algorithm 4.2**: Left Recursion Elimination
- **Algorithm 4.3**: Left Factoring  
- **FIRST/FOLLOW Computation** for LL(1) parsing tables

## 🔧 **Features**

- ✅ **Pure vanilla JS** - No frameworks
- ✅ **Mobile responsive** design
- ✅ **Handles direct/indirect recursion**
- ✅ **Real-time grammar validation**
- ✅ **Copy-paste friendly** examples
- ✅ **Dark theme** UI
- ✅ **Mode switching** without page reload

## 📱 **Browser Support**

| Browser | Status |
|---------|--------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ✅ Full |
| Edge | ✅ Full |

## ⚡ **Limitations**

- Single non-terminal per line (A→...)
- Max 10 non-terminals recommended
- No grammar cycle detection
- Educational focus (not production parser generator)

## 🙏 **Acknowledgments**

- Built for **CSE coursework** on Compiler Design
- Icons and inspiration from academic compiler resources
- Thanks to all students struggling with grammar transformations!

---

**⭐ Star this repo if it helps your compiler studies!**
