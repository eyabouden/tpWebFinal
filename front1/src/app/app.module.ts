import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
 // adjust path

@NgModule({
  imports: [
    ReactiveFormsModule,
    // other imports...
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class AppModule {}
