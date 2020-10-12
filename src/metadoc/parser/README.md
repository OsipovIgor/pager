# Структура узла

## Type 0 nodes имеет следующую структуру

```javascript
{
  type: string,
  props: {
    "title": "metaDOC description",
    "author": "Dan Brown",
    "version": "3.43",
    "hash": "25b886356ee66309c98012eb9da0fd3ec03601d45cbb1314bff945",
    "lang": "ru"
  },
  children: [ {Type 20 nodes} ]
}
```

## Type 20 nodes имеют структуру

```javascript
{
  type: string,
  props: {},
  children: [ {Type 20 nodes} ],
  content: ''
}
```
