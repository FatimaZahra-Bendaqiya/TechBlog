import {Component, OnInit} from '@angular/core';
import {Visitor} from "@angular/compiler";
import {VisitorService} from "./visitor.service";
import {UserService} from "../servicesSecurity/user.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {VisitorModel} from "./visitor.model";

@Component({
  selector: 'app-visitor',
  templateUrl: './visitor.component.html',
  styleUrls: ['./visitor.component.css']
})
export class VisitorComponent implements OnInit{
  visitor?: VisitorModel;
  visitorList?: VisitorModel[];

  info: any;

  constructor(
    private visitorService: VisitorService,
    private userService: UserService,
    private token: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.getVisitors();
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
  }

  getVisitors(): void {
    this.visitorService.getVisitors()
      .subscribe(visitorList => this.visitorList = visitorList);
  }



}
