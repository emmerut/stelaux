from django.db import models
from django.utils.text import slugify
from django.urls import reverse

class ContentBase(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    slug = models.SlugField(unique=True, max_length=255, editable=False)
    content = models.TextField(verbose_name="Content")
    main_image = models.ImageField(upload_to="content_images", blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    redirect_url = models.URLField(blank=True, null=True, verbose_name="Redirect URL")

    class Meta:
        abstract = True

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        if self.redirect_url:
            return self.redirect_url
        return reverse('content-detail', kwargs={'slug': self.slug})


# Specific content models
class Article(ContentBase):
    author = models.CharField(max_length=255, verbose_name="Author")
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name = "Article"
        verbose_name_plural = "Articles"

class StaticPage(ContentBase):
    order = models.IntegerField(default=0, verbose_name="Order")

    class Meta:
        verbose_name = "Static Page"
        verbose_name_plural = "Static Pages"
        ordering = ['order']

class Gallery(ContentBase):
    images = models.ManyToManyField('Image', blank=True)

    class Meta:
        verbose_name = "Gallery"
        verbose_name_plural = "Galleries"

class Video(ContentBase):
    video_url = models.URLField(verbose_name="Video URL")

    class Meta:
        verbose_name = "Video"
        verbose_name_plural = "Videos"


# Model for Images
class Image(models.Model):
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