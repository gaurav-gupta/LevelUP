import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.route';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthGuard } from './_guards/auth.guard';
import { StorageService } from './services/storage.service';
import { DashAuthService } from './services/dashAuth.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { PublisherComponent } from './components/publisher/publisher.component';
import { ChangeHeaderService } from './services/change-header.service';
import { TransactionService } from './services/transaction.service';
import { PublisherService } from './services/publisher.service';
import { TransactionComponent } from './components/transaction/transaction.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponentComponent,
        HomeComponent,
        NavBarComponent,
        TransactionComponent,
        PublisherComponent
    ],
    imports: [
        BrowserModule,
        routing,
        FormsModule,
        DataTableModule,
        HttpClientModule,
        HttpModule,
        EditorModule,
        FlashMessagesModule.forRoot()
    ],
    providers: [
        appRoutingProviders ,
        StorageService,
        AuthGuard,
        DashAuthService,
        ChangeHeaderService,
        PublisherService,
        TransactionService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
