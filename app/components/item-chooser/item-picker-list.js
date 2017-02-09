import Ember from 'ember';

let ItemPickerList = Ember.Component.extend({
  selectedItem: null,
  actions: {
    pick(item) {
      this.get('onPick')(item);
    }
  }
});

ItemPickerList.reopenClass({
  positionalParams: ['items', 'onPick', 'detailComponent']
});

export default ItemPickerList;
