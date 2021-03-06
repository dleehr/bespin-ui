import { moduleFor, test } from 'ember-qunit';

moduleFor('adapter:user', 'Unit | Adapter | user', {
  // Specify the other units that are required for this test.
  needs: ['service:session']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('it returns current-user url for queryRecord', function(assert) {
  let adapter = this.subject();
  let url = adapter.urlForQueryRecord({}, 'user');
  assert.equal(url, '/users/current-user/')
});
