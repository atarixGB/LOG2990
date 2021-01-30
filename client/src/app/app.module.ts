import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FileMenuComponent } from './components/sidebar/file-menu/file-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, FileMenuComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, MatIconModule, MatButtonModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
