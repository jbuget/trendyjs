import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import referentialRepository from '../../../lib/infrastructure/repositories/referential-repository';

describe('Unit | Infrastructure | Repository | Referential', function () {

  describe('#fetchData', function () {

    it('should return Web frameworks data', () => {
      const expectedServices = {
        angular: {
          name: 'Angular',
          description: 'One framework. Mobile & desktop.',
          ref: 'angular',
          npmPackage: 'angular', // FIXME
          githubRepository: 'angular/angular',
          stackoverflowTag: 'angular2'
        },
        angularjs: {
          name: 'AngularJS (ex-Angular 1.x)',
          description: 'HTML enhanced for web apps!',
          ref: 'angularjs',
          npmPackage: 'angular',
          githubRepository: 'angular/angular.js',
          stackoverflowTag: 'angularjs'
        },
        aurelia: {
          name: 'Aurelia',
          description: 'Aurelia is the most powerful, flexible and forward-looking JavaScript client framework in the world.',
          ref: 'aurelia',
          npmPackage: 'aurelia-framework',
          githubRepository: 'aurelia/framework',
          stackoverflowTag: 'aurelia'
        },
        backbone: {
          name: 'Backbone',
          description: 'Give your JS App some Backbone with Models, Views, Collections, and Events.',
          ref: 'backbone',
          npmPackage: 'backbone',
          githubRepository: 'jashkenas/backbone',
          stackoverflowTag: 'backbone.js'
        },
        elm: {
          name: 'ELM',
          description: 'A delightful language for reliable webapps.',
          ref: 'elm',
          npmPackage: 'elm',
          githubRepository: 'elm-lang/elm-platform',
          stackoverflowTag: 'elm'
        },
        ember: {
          name: 'Ember',
          description: 'A framework for creating ambitious web applications.',
          ref: 'ember',
          npmPackage: 'ember-cli',
          githubRepository: 'emberjs/ember.js',
          stackoverflowTag: 'ember.js'
        },
        react: {
          name: 'React',
          description: 'A JavaScript library for building user interfaces.',
          ref: 'react',
          npmPackage: 'react',
          githubRepository: 'facebook/react',
          stackoverflowTag: 'reactjs'
        },
        riot: {
          name: 'Riot',
          description: 'Simple and elegant component-based UI library',
          ref: 'riot',
          npmPackage: 'riot',
          githubRepository: 'riot/riot',
          stackoverflowTag: 'riot'
        },
        vuejs: {
          name: 'Vue.js',
          description: 'The Progressive JavaScript Framework.',
          ref: 'vuejs',
          npmPackage: 'vue',
          githubRepository: 'vuejs/vue',
          stackoverflowTag: 'vue.js'
        }
      };

      return referentialRepository.fetchData().then(result => {
        expect(result).to.deep.equal(expectedServices);
      });
    });

  });
});

