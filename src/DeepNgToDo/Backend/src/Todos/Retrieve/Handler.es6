'use strict';

import DeepFramework from 'deep-framework';

export default class Handler extends DeepFramework.Core.AWS.Lambda.Runtime {

  /**
   * @param {Array} args
   */
  constructor(...args) {
    super(...args);
  }

  handle(request) {
    if (request.data.Id) {
      this.retrieveTodo(request.data.Id, (todo) => {
        return this.createResponse(todo).send();
      });
    } else {
      this.retrieveAllTodos((result) => {
        return this.createResponse(result).send();
      });
    }
  }

  /**
   * Retrieve todo
   * @param callback
   */
  retrieveAllTodos(callback) {
    let deepDb = DeepFramework.Kernel.container.get('db');
    let Todo = deepDb.get('Todos');

    Todo.findAll((err, todo) => {
      if (err) {
        throw new DeepFramework.Core.Exception.DatabaseOperationException(err);
      }

      return callback(todo.Items);
    });
  }

  /**
   * retrieve Todo
   * @param todoId
   * @param callback
   */
  retrieveTodo(todoId, callback) {
    let deepDb = DeepFramework.Kernel.container.get('db');
    let Todo = deepDb.get('Todos');

    Todo.findOneById(todoId, (err, todo) => {
      if (err) {
        throw new DeepFramework.Core.Exception.DatabaseOperationException(err);
      }

      return callback(todo ? todo.get() : null);
    });
  }
}