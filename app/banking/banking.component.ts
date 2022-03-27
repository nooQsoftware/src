import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { MatNativeDateModule } from "@angular/material/core";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from "ngx-file-drop";
import { combineLatest, Observable, of, Subject, timer } from "rxjs";
import {
  finalize,
  first,
  map,
  mergeMap,
  startWith,
  take,
  tap,
} from "rxjs/operators";
import {
  ClubsService,
  statementData,
  statementDataLine,
} from "../clubs.service";
import { memberAutoResponse } from "../member.service";

@Component({
  selector: "app-banking",
  templateUrl: "./banking.component.html",
  styleUrls: ["./banking.component.less"],
})
export class BankingComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  matches: Observable<statementData>;
  data: statementData;
  clubInfo: any;
  incompletes: Observable<
    {
      id: number;
      club: number;
      hash: string;
      complete: boolean;
      filename: string;
      uploaded: Date;
      minDate: Date;
      maxDate: Date;
    }[]
  >;
  posting: boolean;

  constructor(
    private club: ClubsService,
    private snack: MatSnackBar,
    private router: Router,
    auth: AuthService,
    route: ActivatedRoute
  ) {
    this.clubInfo = route.data.pipe(
      tap((v) => console.log(v)),
      map((d) => d.clubs.find((v) => v.approved))
    );
    this.incompletes = club.getIncompleteBanking();
    route.queryParams
      .pipe(
        tap((v) => {
          if (v.es != null) this.statementSelected({ value: Number(v.es) });
        })
      )
      .subscribe();
  }

  @ViewChild("#select-existing")
  selectExisting: MatSelect;

  openFileSelector() {}

  ngOnInit(): void {
    console.log(this.selectExisting);
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          // You could upload it like this:
          this.matches = this.club.uploadBanking(droppedFile, file).pipe(
            tap((data) => (this.data = data)),
            tap((data) => {
              if (data.fromExisting && data.id != null) {
              }
            })
          );
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  anyToPost() {
    return this.data?.data?.some((v) => v.post);
  }

  public fileOver(event: DragEvent) {
    console.log(event.dataTransfer.files);
  }

  public fileLeave(event) {
    console.log(event);
  }

  lineConfirmed(item: statementDataLine) {
    return item.post && !item.posted;
  }

  confirmLine(item, evt) {
    console.log(this.data);
    item.post = evt.target.checked;
    item.member = item.members.find(
      (v) => v.entry.id == item.selectedId
    )?.entry;
  }

  setSelected(item: statementDataLine, evt: MatSelectChange) {
    console.log(item, evt);
    item.selectedId = evt.value;
    item.member = item.members.find(
      (v) => v.entry.id == item.selectedId
    )?.entry;
  }

  getSelectedName(item: statementDataLine) {
    return item.members.find((m) => m.entry.id == item.selectedId)?.entry?.name;
  }

  setState(
    item: statementDataLine | null,
    state: "clear" | "posted" | "post" | "toggle",
    bulk: boolean = false
  ) {
    if (item == null) {
      if (state == "clear") {
        this.snack
          .open(
            `Warning: marking posted items as un-posted can result in double recording`,
            "confirm",
            { duration: 5000, politeness: "assertive" }
          )
          .onAction()
          .subscribe(() => {
            this.data.data.forEach((line) => this.setState(line, state, true));
            return this.postSelection();
          });
      } else if (state == "post") {
        this.data.data
          .filter((d) => !d.posted)
          .forEach((line) => this.setState(line, state, true));
      } else {
        this.data.data.forEach((line) => this.setState(line, state, true));
        this.postSelection();
      }
    } else {
      switch (state) {
        case "clear":
          if (bulk) {
            item.post = item.posted = false;
          } else {
            this.snack
              .open(
                `Warning: marking a posted item as un-posted can result in double recording`,
                "confirm",
                { duration: 5000, politeness: "assertive" }
              )
              .onAction()
              .subscribe(() => {
                item.post = item.posted = false;
                this.postSelection([item]);
              });
          }
          break;
        case "post":
          item.posted = false;
          item.post = true;
          break;
        case "posted":
          item.posted = true;
          item.post = false;
          if (!bulk) this.postSelection([item]);
          break;
        case "toggle":
          item.posted = false;
          item.post = !item.post;
          break;
        default:
          return;
      }
    }
  }

  setMember(item: statementDataLine, evt: memberAutoResponse) {
    console.log("setting member", item, evt);
    item.member = evt;
    item.members = [{ confidence: 100, entry: evt }];
  }

  protected postingComplete = new Subject();

  postSelection(items: statementDataLine[] = null) {
    this.matches = this.club
      .postBanking(
        items != null
          ? Object.assign(
              {},
              {
                data: items,
                id: this.data.id,
                received: true,
                fromExisting: this.data.fromExisting,
              }
            )
          : this.data
      )
      .pipe(
        startWith(this.data),
        take(2),
        tap((d) => (this.posting = true)),
        tap((d) => (this.data = d)),
        finalize(() => {
          this.posting = false;
          return this.postingComplete.next();
        })
      );
  }

  statementSelected(evt: MatSelectChange | { value: number }) {
    console.log("statementSelected", evt);
    if (evt instanceof MatSelectChange)
      this.router.navigate([], { queryParams: { es: evt.value } });
    this.matches = this.club
      .getExisting(evt.value)
      .pipe(tap((d) => (this.data = d)));
  }

  statementRange(st: {
    minDate: string | Date;
    maxDate: string | Date;
    items: number;
  }) {
    if (typeof st.minDate == "string") st.minDate = new Date(st.minDate);
    if (typeof st.maxDate == "string") st.maxDate = new Date(st.maxDate);
    return `${st.items} items, dated ${st.minDate.toLocaleDateString(
      "en-GB"
    )}-${st.maxDate.toLocaleDateString("en-GB")}`;
  }

  deleteStatementRecord() {
    this.incompletes = this.snack
      .open(
        `Deleting the statement record allows it to be re-submitted as if it had never been processed. All record of existing postings will be lost. Use with caution!`,
        "confirm",
        { duration: 15000 }
      )
      .onAction()
      .pipe(
        mergeMap(() => this.club.deleteStatementData(this.data.id)),
        tap(() => (this.matches = this.data = null)),
        mergeMap(() => this.club.getIncompleteBanking())
      );
  }

  markComplete() {
    this.incompletes = this.snack
      .open(
        `This removes the statement from the existing statement list, but re-uploading will retain existing state. This option is safe.`,
        "confirm",
        { duration: 15000 }
      )
      .onAction()
      .pipe(
        mergeMap(() => this.club.markStatementComplete(this.data.id)),
        tap(() => (this.matches = this.data = null)),
        mergeMap(() => this.club.getIncompleteBanking())
      );
  }
}
