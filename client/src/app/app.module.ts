import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingSurfaceComponent } from './components/drawing-surface/drawing-surface.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { EraserConfigComponent } from './components/sidebar/eraser-config/eraser-config.component';
import { FileMenuComponent } from './components/sidebar/file-menu/file-menu.component';
import { LineConfigComponent } from './components/sidebar/line-config/line-config.component';
import { PencilConfigComponent } from './components/sidebar/pencil-config/pencil-config.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolsListComponent } from './components/sidebar/tools-list/tools-list.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        FileMenuComponent,
        ToolsListComponent,
        PencilConfigComponent,
        EraserConfigComponent,
        LineConfigComponent,
        DrawingSurfaceComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatGridListModule,
        MatTooltipModule,
        BrowserAnimationsModule,
        DragDropModule,
        MatSliderModule,
        FormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
