# Redosy [![Build Status](https://travis-ci.org/alxolr/redosy.svg?branch=master)](https://travis-ci.org/alxolr/redosy)

> Redosy is a global npm package that scans your javascript source files for ReDoS

## Installation

```bash
npm install -g redosy
```

## Usage

```bash
redosy ./path/to/your/project/folder
```

## Result

```bash
Redosy scans your application for Regex Denial of Service errors.
Was found the following issues

index.js
/([a-zA-Z]+)*/i on line 3 column 29
/([a-zA-Z]+)*/i on line 4 column 30
```
