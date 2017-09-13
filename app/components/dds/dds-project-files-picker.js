import Ember from 'ember';

const DDSProjectFilesPicker = Ember.Component.extend({
  projects: null,
  project: null,
  selectedResources: null,
  formatSettings: null,
  onFilePicked: (/* file */) => {},
  actions: {
    projectChanged(project) {
      this.set('project', project);
    },
    filePicked(file) {
      this.get('onFilePicked')(file);
    }
  }
});

DDSProjectFilesPicker.reopenClass({
  positionalParams: ['projects', 'selectedResources', 'onFilePicked']
});

export default DDSProjectFilesPicker;
