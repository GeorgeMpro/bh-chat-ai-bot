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
  template: `
    <div class="chat-messages" #messageContainer>
      @for (msg of messages(); track trackMessage($index, msg)) {
      <app-message-item [msg]="msg" />
      }
    </div>
  `,
  styleUrl: 'message-list.component.scss',
  imports: [MessageItemComponent],
})
export class MessageListComponent {
  /** Delay before scrolling (ms) */
  private readonly SCROLL_DELAY = 0;

  /**
   * Array of messages to display
   *
   * @description
   * Required input containing all chat messages in chronological order
   */
  messages = input.required<Message[]>();

  /**
   * Reference to the scrollable container element
   */
  messageContainer = viewChild<ElementRef>('messageContainer');

  /**
   * Flag to control scroll behavior
   */
  private shouldAutoScroll = signal(true);

  /**
   * Constructor sets up auto-scroll effect
   *
   * @description
   * Creates an effect that watches for message changes
   * and automatically scrolls to the bottom when new
   * messages are added.
   */
  constructor() {
    this.setupAutoScroll();
  }

  /**
   * Track by function for message list
   *
   * @description
   * Helps Angular efficiently update the list by tracking
   * messages by their index. This improves performance when
   * messages are added or removed.
   *
   * @param {number} index - The message index
   * @param {Message} message - The message object
   * @returns {number} The tracking identifier
   */
  protected trackMessage(index: number, message: Message): number {
    return index;
  }

  /**
   * Sets up the auto-scroll effect
   *
   * @private
   * @description
   * Creates an effect that monitors message changes and
   * automatically scrolls to show the latest message.
   */
  private setupAutoScroll(): void {
    effect(() => {
      if (this.shouldScrollToBottom()) {
        this.scrollToBottom();
      }
    });
  }

  /**
   * Checks if should scroll to bottom
   *
   * @private
   * @returns {boolean} True if conditions are met for scrolling
   */
  private shouldScrollToBottom(): boolean {
    const hasMessages = this.messages().length > 0;
    const hasContainer = this.messageContainer() !== undefined;
    const autoScrollEnabled = this.shouldAutoScroll();

    return hasMessages && hasContainer && autoScrollEnabled;
  }

  /**
   * Scrolls the container to the bottom
   *
   * @private
   * @description
   * Uses setTimeout to ensure DOM has updated before scrolling.
   * This prevents race conditions with message rendering.
   */
  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.getContainerElement();

      if (container) {
        this.performScroll(container);
      }
    }, this.SCROLL_DELAY);
  }

  /**
   * Gets the native container element
   *
   * @private
   * @returns {HTMLElement | null} The container element or null
   */
  private getContainerElement(): HTMLElement | null {
    return this.messageContainer()?.nativeElement ?? null;
  }

  /**
   * Performs the actual scroll operation
   *
   * @private
   * @param {HTMLElement} container - The element to scroll
   */
  private performScroll(container: HTMLElement): void {
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Enables auto-scrolling
   *
   * @description
   * Can be called to re-enable auto-scroll if it was disabled
   *
   * @example
   * ```typescript
   * component.enableAutoScroll();
   * ```
   */
  enableAutoScroll(): void {
    this.shouldAutoScroll.set(true);
  }

  /**
   * Disables auto-scrolling
   *
   * @description
   * Useful when user wants to scroll up to read history
   * without being interrupted by new messages
   *
   * @example
   * ```typescript
   * component.disableAutoScroll();
   * ```
   */
  disableAutoScroll(): void {
    this.shouldAutoScroll.set(false);
  }
}
