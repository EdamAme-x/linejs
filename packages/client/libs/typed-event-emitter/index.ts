import type { LooseType } from "../../entities/common.ts";

type RecordEvent = Record<string, (...args: LooseType[]) => LooseType>;

export class TypedEventEmitter<
	T extends RecordEvent,
	E extends keyof T = keyof T,
> {
	public listeners: Map<E, T[E][]> = new Map();

	public on<E2 extends E>(event: E2, ...listeners: T[E2][]): this {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}

		for (const listener of listeners) {
			this.listeners.get(event)?.push(listener);
		}

		return this;
	}

	public off<E2 extends E>(event: E2, ...listeners: T[E2][]): this {
		if (this.listeners.has(event)) {
			for (const listener of listeners) {
				if (!this.listeners.get(event)?.includes(listener)) continue;

				this.listeners
					.get(event)
					?.splice(this.listeners.get(event)?.indexOf(listener) ?? 0, 1);
			}
		}

		return this;
	}

	public emit<E2 extends E>(event: E2, ...args: Parameters<T[E2]>): this {
		if (this.listeners.has(event)) {
			this.listeners.get(event)?.forEach((listener) => listener(...args));
		}

		return this;
	}
}
