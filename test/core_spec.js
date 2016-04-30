import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
  describe('setEntries', () =>{
    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];

      const nextState = setEntries(state, entries);
      let test1 = nextState.get('entries');
      let test2 = List.of('Trainspotting', '28 Days Later');


      expect(test1).to.equal(test2);
    });
  });

  describe('next', ()=>{
    it('takes the next two entries under vote', ()=>{
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Sunshine')
      }));
    });

    it('marks winner when just one entry lieft', ()=>{
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(
        Map({
          winner: 'Trainspotting'
        })
      );
    });
  });

  describe('vote', ()=>{

    it('create a tally for the voted entry', ()=>{
      /*const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List()
      });*/
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });
      const nextState = vote(state, 'Trainspotting');
      /*expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 1
          })
        }),
        entries: List()
      }));*/
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting':1
        })
      }));
    });

    it('add to existing tally for the voted entry', ()=>{
      /*const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          })
        }),
        entries: List()
      });*/
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        })
      });

      const nextState = vote(state, 'Trainspotting');
      /*expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List()
      }));*/
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        })
      }));
    });

    it('put winner of current vote back to entries', ()=>{
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });

      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }));
    });

    it('puts both from tied vote back to entries', ()=>{
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting' :3,
            '28 Days Later': 3
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }));
    });
  });
});
