import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';

@Component({
  imports: [RouterModule, ChatComponent],
  selector: 'app-root',
  template: `
    <main class="content">
      <!--      todo-->
      <!--      <router-outlet></router-outlet>-->
      <app-chat></app-chat>
    </main>
  `,
  styles: `
    .content {
      flex: 1;
      align-content: center;
    }
  `,
})
export class AppComponent {}
