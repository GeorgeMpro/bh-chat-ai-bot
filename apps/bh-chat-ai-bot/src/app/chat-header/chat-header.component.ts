import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-header',
  template: `
    <header class="chat-header">
      <div class="header-content">
        <h2>{{ title }}</h2>
        <!--        todo add how many users connected-->
        <p class="subtitle">{{ subtitle }}</p>
      </div>
    </header>
  `,
  styles: [
    `
      .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: #2d3748;
        color: white;
      }

      .header-content {
        h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .subtitle {
          font-size: 12px;
          opacity: 0.9;
          margin: 4px 0 0 0;
        }
      }

      .header-actions {
        display: flex;
        gap: 12px;

        .icon-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        }
      }
    `,
  ],
})
export class ChatHeaderComponent {
  title = 'Chat With Bot';
  subtitle = 'x users connected';
}
