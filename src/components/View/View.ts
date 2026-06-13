import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Базовый класс для View компонентов с поддержкой событий
 */
export abstract class View<T> extends Component<T> {
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
	}
}