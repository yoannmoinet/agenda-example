# Agenda
> A little backbone / marionette example

## Installation

```bash
> git clone git@github.com:yoannmoinet/agenda.git
> cd agenda
> npm i -g gulp
```

## Usage

Will run a local server accessible via [http://localhost:3000](http://localhost:3000).

```bash
> gulp
```

There are two routes available to deliver the data :

- `/agenda` : for all available slots and delimitation of the agenda
- `/agenda/offer` : for a specific offer to place in the agenda

The most important part (I guess) would be the [`Agenda`](./app/js/models/Agenda.js) model.

---
### License MIT
