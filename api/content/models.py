from django.db import models
from django.utils.text import slugify
from django.urls import reverse
# from users.model import UserBase

# Abstract model for content

class ContentBase(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title", null=True)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(unique=True, max_length=255, editable=False, null=True)
    content = models.TextField(verbose_name="Content", blank=True, null=True)
    component = models.CharField(max_length=255, blank=True, null=True)
    main_image = models.ImageField(upload_to="stela-editor/main-image/", blank=True, null=True) 
    thumbnail = models.ImageField(upload_to="stela-editor/thumbnail/", blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    redirect_url = models.URLField(blank=True, null=True, verbose_name="Redirect URL")
    # owner = models.ForeignKey(UserBase, on_delete=models.CASCADE, related_name="info")

    class Meta:
        abstract = True

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.title:
            super().save(*args, **kwargs)
            return

        if not self.slug:
            self.slug = slugify(self.title)

        original_slug = self.slug
        counter = 1

        while self.__class__.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
            self.slug = f"{original_slug}-{counter}"
            counter += 1

        super().save(*args, **kwargs)

    def get_absolute_url(self):
        if self.redirect_url:
            return self.redirect_url
        return reverse('content-detail', kwargs={'slug': self.slug})

class Section(ContentBase):
    class Meta:
        verbose_name = "Page"
        verbose_name_plural = "Pages"

# Specific content models
class Article(ContentBase):
    author = models.CharField(max_length=255, verbose_name="Author")
    category = models.ForeignKey('Category', on_delete=models.CASCADE)

    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"

class StaticPage(ContentBase):
    order = models.IntegerField(default=0, verbose_name="Order")

    class Meta:
        verbose_name = "Static Page"
        verbose_name_plural = "Static Pages"
        ordering = ['order']

class InfoComponent(models.Model):
    parent = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="info", null=True)
    title_bullet = models.CharField(max_length=255, verbose_name="Title")
    content_bullet = models.TextField(verbose_name="Content")
    numbers = models.IntegerField(default=0, null=True)
    icons = models.CharField(max_length=255, null=True)
    
    def get_absolute_url(self):
        return reverse(self.slug, args=[str(self.id)])
    
    class Meta:
        verbose_name = "Info Component"
        verbose_name_plural = "Info Component"
        
class FileStorage(models.Model):
    parent = models.ForeignKey(Section, on_delete=models.CASCADE, related_name="files")
    file_data = models.FileField(upload_to='files/')
    
    class Meta:
        verbose_name = "File Storage"
        verbose_name_plural = "Files Storage"
        
class Gallery(models.Model):
    images = models.ManyToManyField('Image', blank=True)

    class Meta:
        verbose_name = "Gallery"
        verbose_name_plural = "Galleries"

class Video(models.Model):
    parent = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='videos')
    name = models.CharField(max_length=255, verbose_name="Name")
    video = models.FileField(upload_to='video/')

    class Meta:
        verbose_name = "Video"
        verbose_name_plural = "Videos"

# Model for Images
class Image(models.Model):
    parent = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='images')
    name = models.CharField(max_length=255, verbose_name="Name")
    image = models.ImageField(upload_to="gallery_images")
    
    def __str__(self):
        return self.name

# Model for Categories
class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name="Name")
    slug = models.SlugField(unique=True, max_length=255, editable=False)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('category-detail', kwargs={'slug': self.slug})

