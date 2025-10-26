import {
  Component,
  input,
  effect,
  viewChild,
  ElementRef,
  signal,
} from '@angular/core';
import { MessageItemComponent } from '../message-item/message-item.component';
import { Message } from '../models/message.model';

/**
 * Message list component for displaying chat message history
 *
 * @description
 * The MessageListComponent renders a scrollable list of messages
 * and automatically scrolls to the newest message when new messages
 * arrive. It uses Angular's effect API to react to message changes
 * and provides smooth scrolling behavior.
 *
 * @example
 * ```typescript
 * <app-message-list [messages]="messageHistory"></app-message-list>
 * ```
 *
 * @remarks
 * Features:
 * - Auto-scroll to newest message
 * - Smooth scroll behavior
 * - Custom scrollbar styling
 * - Performance optimized with trackBy
 */
@Component({
  selector: 'app-message-list',
  standalone: true,
  templateUrl: 'message-list.component.html',
  styleUrl: 'message-list.component.scss',
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  private readonly SCROLL_DELAY = 0;

  messages = input.required<Message[]>();

  messageContainer = viewChild<ElementRef>('messageContainer');

  private shouldAutoScroll = signal(true);

  constructor() {
    this.setupAutoScroll();
  }

  protected trackMessage(index: number, message: Message): number {
    return index;
  }

  private setupAutoScroll(): void {
    effect(() => {
      if (this.shouldScrollToBottom()) {
        this.scrollToBottom();
      }
    });
  }

  private shouldScrollToBottom(): boolean {
    const hasMessages = this.messages().length > 0;
    const hasContainer = this.messageContainer() !== undefined;
    const autoScrollEnabled = this.shouldAutoScroll();

    return hasMessages && hasContainer && autoScrollEnabled;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.getContainerElement();

      if (container) {
        this.performScroll(container);
      }
    }, this.SCROLL_DELAY);
  }

  private getContainerElement(): HTMLElement | null {
    return this.messageContainer()?.nativeElement ?? null;
  }

  private performScroll(container: HTMLElement): void {
    container.scrollTop = container.scrollHeight;
  }
}
