import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/authentication/auth.service";
import {User} from "../../models/User";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  user = {} as User;

  constructor(private userService: AuthService,
              private messageService: MessageService) {
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.user = res;
    }, () => {
      this.messageService.add({severity: 'error', summary: 'Error', detail: "Couldn't load user Data!"});
    })
  }

}
