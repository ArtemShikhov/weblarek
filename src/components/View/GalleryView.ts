import { View } from './View';
import { IEvents } from '../base/Events';

export class GalleryView extends View<{ items: HTMLElement[] }> {
	private catalogElement: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.catalogElement = container;
	}

	set items(items: HTMLElement[]) {
		this.catalogElement.replaceChildren(...items);
	}
}