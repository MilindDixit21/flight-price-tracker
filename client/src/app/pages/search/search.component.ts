import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  private api = inject(ApiService);

  message = signal('Connecting...');
  loading = signal(true);

  constructor(){}

  ngOnInit(): void {
      this.api.testConnection().subscribe({
        next:(res)=>{
          this.message.set(res.message || 'App Connected');
          this.loading.set(false);
        },
        error:(err) => {
            console.error(err);
            this.message.set('Connection failed!');
            this.loading.set(false);
        }
      });
  }

}
