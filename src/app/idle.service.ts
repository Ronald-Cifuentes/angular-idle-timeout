import {Injectable} from '@angular/core'
import {Observable, Subject, Subscription, interval, throttle} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleSubject = new Subject<boolean>()
  private timeOut = 10 // seconds
  private lastActivity?: Date
  private idleCheckInterval = 1 // seconds
  private idleSuscription?: Subscription

  constructor() {
    this.resetTimer()
    this.startWatching()
  }

  get idleState(): Observable<boolean> {
    return this.idleSubject.asObservable()
  }

  private startWatching() {
    this.idleSuscription = interval(this.idleCheckInterval * 1000)
      .pipe(throttle(() => interval(1000)))
      .subscribe(() => {
        const now = new Date()

        if (
          now.getTime() - this.lastActivity?.getTime()! >
          this.timeOut * 1000
        ) {
          this.idleSubject.next(true)
        }
      })
  }

  resetTimer() {
    this.lastActivity = new Date()
    this.idleSubject.next(false)
  }

  stopWatching() {
    if (this.idleSuscription) {
      this.idleSuscription.unsubscribe()
    }
  }
}
