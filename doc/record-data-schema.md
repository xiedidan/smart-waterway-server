# Record Data Schema

## Marker

``` javascript
{
    error: Boolean,
    shift: Boolean,
}
```

## Hydrology

``` javascript
{
    level: Number,
    rate: Number,
}
```

## Weather

``` javascript
{
    weather: Number, // CONSTS.WEATHER
    level: Number, // may be 1 - 5
    temperature: Number,
    humidity: Number,
}
```

## Ship

``` javascript
{
    speed: Number,
}
```
