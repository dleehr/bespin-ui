import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  workflowVersion: DS.belongsTo('workflow-version'),
  name: DS.attr('string'),
  created: DS.attr('date'),
  state: DS.attr('string'),
  step: DS.attr('string'),
  lastUpdated: DS.attr('date'),
  vmFlavor: DS.attr('string'),
  vmInstanceName: DS.attr('string'),
  vmProjectName: DS.attr('string'),
  jobOrder: DS.attr('string'), // This is JSON, no need to test it
  finished: Ember.computed('state', function() {
    let state = this.get('state');
    return state === 'F';
  }),
  outputDir: DS.belongsTo('job-output-dir'),
  updateAfterAction(data) {
    // The action methods respond with an updated job, so we must update the local store
    // with that payload. Remember, pushPayload doesn't return.
    this.store.pushPayload('job', data);
    return Ember.RSVP.resolve(this.store.peekRecord(this.constructor.modelName, this.get('id')));
  },

  start() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.start(this.get('id')).then(this.updateAfterAction.bind(this));
  },
  cancel() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.cancel(this.get('id')).then(this.updateAfterAction.bind(this));
  },
  restart() {
    let adapter = this.store.adapterFor(this.constructor.modelName);
    return adapter.restart(this.get('id')).then(this.updateAfterAction.bind(this));
  }
});
