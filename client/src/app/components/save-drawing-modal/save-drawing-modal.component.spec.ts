import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexService } from '@app/services/index/index.service';
import { Message } from '@common/communication/message';
import { SaveDrawingModalComponent } from './save-drawing-modal.component';

// tslint:disable
fdescribe('SaveDrawingModalComponent', () => {
    let component: SaveDrawingModalComponent;
    let fixture: ComponentFixture<SaveDrawingModalComponent>;
    let indexServiceSpy: jasmine.SpyObj<any>;
    let indexService: IndexService;
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveDrawingModalComponent],
            imports: [MatIconModule, MatDialogModule, MatInputModule, MatFormFieldModule, FormsModule, BrowserAnimationsModule, MatTooltipModule],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: mockDialogRef,
                },
                {
                    provide: IndexService,
                    useValue: indexServiceSpy,
                },
            ],
        }).compileComponents();

        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicPost']);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SaveDrawingModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('removeTag() should remove tag in tags[] array', () => {
        const tagToRemove: string = 'testTag';
        const expectedValue: string[] = ['tag1', 'tag3'];
        component.tags = ['tag1', 'testTag', 'tag3'];
        component.removeTag(tagToRemove);
        expect(component.tags).toEqual(expectedValue);
        expect(component.tags.length).toEqual(expectedValue.length);
    });

    it('addTag() should add tag to tags[] array', () => {
        const expectedValue: string[] = ['testTag'];
        component.tags = [];
        component.tagInput = 'testTag';
        component.addTag();
        expect(component.tags).toEqual(expectedValue);
        expect(component.tags.length).toEqual(expectedValue.length);
    });

    it('sendToServer() should return true if drawing title is valid', fakeAsync((message: Message) => {
        spyOn(indexService, 'basicPost').and.returnValue(indexService['http'].post<void>(indexService['BASE_URL'] + '/send', message));
        expect(indexService['basicPost']).toHaveBeenCalled();
    }));

    it('validateTagDuplicate() should return true if tag is duplicate', () => {
        component.tags = ['tag1', 'tag2', 'tag3'];
        component.tagInput = 'tag3';
        component.validateTagDuplicate();
        expect(component.validateTagDuplicate).toBeTruthy();
    });
});
