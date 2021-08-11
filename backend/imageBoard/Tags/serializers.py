from imageBoard.models import Tag, Post

from rest_framework import serializers

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'content']


class TagPostSerializer(serializers.Serializer):
    post = serializers.IntegerField()
    tag = serializers.CharField(max_length=50)

    def validate_tag(self, value):
        ret = value.strip().split()[0].strip() #first word if multiple where provided

        if len(ret) <= 0:
            raise serializers.ValidationError("No Tag provided")
        return ret

    def validate_postId(self, value):
        if Post.objects.filter(id=value).exists():
            return value
        else:
            raise serializers.ValidationError("Post doesn't exist")

    def save(self):
        #validation
        post = self.validated_data["post"]
        tag = self.validated_data["tag"]
        #creation
        post_db = Post.objects.get(id=post)
        tag_db, created = Tag.objects.get_or_create(content=tag)
        post_db.tags.add(tag_db)
        return self.validated_data

