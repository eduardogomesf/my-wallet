import * as EventEmitter from 'events';
import { EventDispatcher } from '../use-case/protocol';
import { Injectable } from '@nestjs/common';

export const eventDispatcher = new EventEmitter({});

@Injectable()
export class BuiltInEventDispatcher implements EventDispatcher {
  constructor() {
    import('./handler');
  }

  dispatch(event: string, data: any) {
    eventDispatcher.emit(event, data);
  }
}
