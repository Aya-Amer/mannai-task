import { Component, OnInit, signal } from '@angular/core';
import { User } from '../../shared/interfaces/user.interface';

@Component({
  selector: 'app-user-details',
  imports: [],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails implements OnInit{
  user= signal<User | null>(null);
  ngOnInit(): void {
      this.user.set(history.state.user);
  }
}
