import {IdleService} from './idle.service'
import {Component, OnDestroy, OnInit, inject} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterOutlet} from '@angular/router'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  idleService = inject(IdleService)
  private idleSubscription?: Subscription

  ngOnInit(): void {
    this.idleService.idleState.subscribe(isIdle => {
      if (isIdle) {
        console.log('User is idle')
      } else {
        console.log('User is active')
      }
    })
  }

  ngOnDestroy(): void {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe()
    }
  }

  onUserAction() {
    this.idleService.resetTimer()
  }
}
