import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {debounceTime} from "rxjs";
import {createAvatar} from '@dicebear/core';
import {bigSmile} from '@dicebear/collection';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-avatar-form',
  templateUrl: './avatar-form.component.html',
  styleUrls: ['./avatar-form.component.scss']
})
export class AvatarFormComponent implements OnInit, OnChanges {
  avatarForm: FormGroup;
  @Output() valid = new EventEmitter<boolean>()
  @Output() avatar = new EventEmitter<string>();
  @Input() userName = ''
  avatarUrls: string[] = [];
  avatarTypesUrls: string[] = ["https://api.dicebear.com/6.x/adventurer/svg?seed=", "https://api.dicebear.com/6.x/big-smile/svg?accessoriesProbability=75&mouth=braces,gapSmile,kawaii,openedSmile,teethSmile", "https://api.dicebear.com/6.x/bottts/svg?seed=", "https://api.dicebear.com/6.x/pixel-art/svg?seed=", "https://api.dicebear.com/6.x/personas/svg?seed=",];

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.avatarForm = this.fb.group({
      avatar: ['', [Validators.required]],
      seed: this.userName
    });
    this.avatarForm.get('seed')?.setValue(this.userName)
  }

  get seed() {
    return this.avatarForm.get('seed')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userName']) {
      this.querryAvatars(this.userName)
      console.log('userName:', this.userName)
    }
  }

  ngOnInit(): void {
    this.avatarForm.statusChanges.subscribe(status => this.valid.emit(status === 'VALID'))
    console.log('seed:', this.seed?.value)
    this.seed?.valueChanges.pipe(debounceTime(450)).subscribe(seed => {
      this.querryAvatars(seed)
    })
    this.avatarForm.valueChanges.subscribe(value => this.avatar.emit(value.avatar))
  }

  onSubmit(): void {
    if (this.avatarForm.valid) {
      this.avatar.emit(this.avatarForm.value.avatar);
    }
  }

  querryAvatars(name: string = "") {
    let avatars: string[] = []
    console.log("avatarUpdating:", avatars)
    for (let i = 0; i < 5; i++) {
      let avatarUrl
      if (i > 0) avatarUrl = createAvatar(bigSmile, {
        seed: this.seed?.value + i,
        mouth: [
          "braces",
          "gapSmile",
          "kawaii",
          "openedSmile",
          "teethSmile"
        ]
      }).toDataUriSync()
      else avatarUrl = createAvatar(bigSmile, {
        seed: name,
        mouth: [
          "braces",
          "gapSmile",
          "kawaii",
          "openedSmile",
          "teethSmile"
        ]
      }).toDataUriSync()
      const sanitizeUrl = <string>this.sanitizer.bypassSecurityTrustUrl(avatarUrl)
      avatars.push(sanitizeUrl)
      this.avatarUrls = avatars
    }
  }
}
