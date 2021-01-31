import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { FileMenuComponent } from './components/sidebar/file-menu/file-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolsListComponent } from './components/sidebar/tools-list/tools-list.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, FileMenuComponent, ToolsListComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, MatIconModule, MatButtonModule, MatListModule, MatGridListModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
