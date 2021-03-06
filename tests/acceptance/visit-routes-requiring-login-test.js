import { test } from 'qunit';
import moduleForAcceptance from 'bespin-ui/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | visit routes requiring login');

test('visiting /jobs requires login', function(assert) {
  visit('/jobs');
  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('visiting /workflows requires login', function(assert) {
  visit('/workflows');
  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});

test('visiting /settings requires login', function(assert) {
  visit('/settings');
  andThen(function() {
    assert.equal(currentURL(), '/login');
  });
});
