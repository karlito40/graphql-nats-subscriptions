import { PubSubEngine } from 'graphql-subscriptions'
import { PubSubAsyncIterator } from './pubsub-async-iterator'

export class NatsPubSub implements PubSubEngine {
  private nats: any
  private queue: String

  constructor({ nats, queue }) {
    this.nats = nats;
    this.queue = queue;
  }

  public async publish(subject: string, payload: any): Promise<void> {
    return await this.nats.publish(subject, JSON.stringify(payload))
  }

  public async subscribe(subject: string, onMessage: Function): Promise<number> {
    return await this.nats.subscribe(subject, this.queue, msg => onMessage(JSON.parse(msg)))
  }

  public unsubscribe(sid: number) {
    this.nats.unsubscribe(sid)
  }

  public asyncIterator<T>(subjects: string | string[]): AsyncIterator<T> {
    return new PubSubAsyncIterator<T>(this, subjects)
  }
}
