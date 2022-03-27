import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { Observable, Subject } from "rxjs";
import { debounceTime, skipUntil, tap, throttle } from "rxjs/operators";

@Directive({
  selector: "[debounced]",
})
export class DebounceDirective implements OnInit {
  @Output() debounced = new EventEmitter();
  @Input() debounceEnd: Observable<any>;
  @Input() time: number;
  private clicks = new Subject();

  @HostBinding("disabled") disabled: boolean;

  constructor() {}

  ngOnInit(): void {
    if (this.debounceEnd != null) {
      this.clicks
        .pipe(
          tap((v) => (this.disabled = true)),
          throttle((v) =>
            this.debounceEnd.pipe(tap((v) => {
              return (this.disabled = false);
            }))
          )
        )
        .subscribe((e) => this.debounced.emit(e));
    } else {
      this.clicks
        .pipe(debounceTime(this.time ?? 500))
        .subscribe((e) => this.debounced.emit(e));
    }
  }

  @HostListener("click", ["$event"])
  clickEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    this.clicks.next(event);
  }
}
